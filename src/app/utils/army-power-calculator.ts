import { AttachSession } from 'protractor/built/driverProviders';
import { FightingArmy } from '../models/army-ranges';
import { GameBalanceConfig, TowerConfig } from '../models/game-config-models';
import { Army, Building, Player, UnitType } from '../models/game-models';
import { buildingToConfig, unitTypeToConfig } from './balance-utils';
import {
  getLeveledValueByLevel,
  isDefensive,
  isFactory,
} from './building-utils';

type Power = {
  droids: number;
  tanks: number;
  cannons: number;

  constant: number;
};

export const calculateBombardingAttackersPower = (
  cannons: number,
  balance: GameBalanceConfig
): number => {
  const singleCannonPower = balance.combat.cannons.power;
  const rawCannonsPower = cannons * singleCannonPower;
  const bombardingPowerFraction =
    balance.upgrades.combat.balanceConfig
      .improvedCannonsBombardingPowerFraction;
  return Math.round(rawCannonsPower * bombardingPowerFraction);
};

export const calculateDefendingFightingArmyPower = (
  army: FightingArmy, // base army
  balance: GameBalanceConfig, // reference to balance
  defender: Player, // mainly for upgrades, but who knows...
  attacker: Player,
  building: Building, // for tower bonuses, etc.
  attackerArmy: Army = { droids: 0, tanks: 0, cannons: 0 },
): number => {
  return calculateDefendingArmyPower(
    army,
    army.scarabs,
    balance,
    defender,
    attacker,
    building,
    attackerArmy
  );
};

export const calculateAttackingArmyPower = (
  army: Army, // base army
  balance: GameBalanceConfig, // reference to balance
  attacker: Player // mainly for upgrades, but who knows...
): number => {
  const basePower = getArmyBasePower(army, balance);
  const postImprovedTanksPower = getOptionalImprovedTanksPower(
    basePower,
    balance,
    attacker
  );
  return Math.round(
    postImprovedTanksPower.droids +
    postImprovedTanksPower.tanks +
    postImprovedTanksPower.cannons +
    postImprovedTanksPower.constant);
};

export const calculateDefendingArmyPower = (
  army: Army, // base army
  scarabs: number, // are we generating some scarabs?
  balance: GameBalanceConfig, // reference to balance
  defender: Player, // mainly for upgrades, but who knows...
  attacker: Player,
  building: Building, // for tower bonuses, etc.,
  attackingArmy: Army = { droids: 0, tanks: 0, cannons: 0 }
): number => {
  const basePower = getArmyBasePower(army, balance);
  const postTowerPower = getOptionalTowerPowerBonuses(
    basePower,
    building,
    balance,
    attacker,
    attackingArmy
  );
  const postFactoryTurretPower = getOptionalFactoryPowerBonuses(
    postTowerPower,
    building,
    balance,
    defender,
    attacker,
    attackingArmy
  );
  const postImprovedDroidsPower = getOptionalImprovedDroidsPower(
    postFactoryTurretPower,
    building,
    balance,
    defender
  );
  const postImprovedTanksPower = getOptionalImprovedTanksPower(
    postImprovedDroidsPower,
    balance,
    defender
  );
  const totalBasicArmyPower =
    postImprovedTanksPower.droids +
    postImprovedTanksPower.tanks +
    postImprovedTanksPower.cannons +
    postImprovedTanksPower.constant;

  return Math.round(getOptionalScarabsPowerBonuses(
    totalBasicArmyPower,
    scarabs,
    balance,
    attacker
  ));
};

const getOptionalScarabsPowerBonuses = (
  totalPower: number,
  scarabs: number,
  balance: GameBalanceConfig,
  attacker: Player
): number => {
  const scarabsPower = calculateScarabsPower(scarabs, balance, attacker);
  return totalPower + scarabsPower;
};

const getOptionalTowerPowerBonuses = (
  power: Power,
  building: Building,
  balance: GameBalanceConfig,
  attacker: Player,
  attackerArmy: Army
): Power => {
  if (!isDefensive(building)) {
    return power;
  }
  const config = buildingToConfig(balance.buildings, building) as TowerConfig;
  let baseProtection = getLeveledValueByLevel(
    config.baseProtection,
    building.level
  );
  let unitBonus = getLeveledValueByLevel(config.unitBonus, building.level);

  // Advanced tactics
  if (isAdvancedTacticsApplicable(attacker, attackerArmy)) {
    const advancedTacticsPenalty = balance.upgrades.combat.balanceConfig.advancedTacticsTowerBonusesDecrease;
    baseProtection = Math.round(baseProtection - (baseProtection * advancedTacticsPenalty));
    unitBonus = Math.round(unitBonus - (unitBonus * advancedTacticsPenalty));
  }

  const { droids, tanks, cannons, constant } = power;
  return {
    droids: droids + droids * unitBonus,
    tanks: tanks + tanks * unitBonus,
    cannons: cannons + cannons * unitBonus,
    constant: constant + baseProtection,
  };
};

const getOptionalFactoryPowerBonuses = (
  power: Power,
  building: Building,
  balance: GameBalanceConfig,
  defender: Player,
  attacker: Player,
  attackerArmy: Army
): Power => {
  if (!isFactory(building)) {
    return power;
  }
  if (!defender.upgrades.includes('FACTORY_TURRET')) {
    return power;
  }
  const towerConfig = balance.buildings.tower;
  const towerLevel =
    balance.upgrades.control.balanceConfig.factoryTurretTowerLevel;
  let baseProtection = getLeveledValueByLevel(
    towerConfig.baseProtection,
    towerLevel
  );
  let unitBonus = getLeveledValueByLevel(towerConfig.unitBonus, towerLevel);

  // Advanced tactics
  if (isAdvancedTacticsApplicable(attacker, attackerArmy)) {
    const advancedTacticsPenalty = balance.upgrades.combat.balanceConfig.advancedTacticsTowerBonusesDecrease;
    baseProtection = Math.round(baseProtection - (baseProtection * advancedTacticsPenalty));
    unitBonus = Math.round(unitBonus - (unitBonus * advancedTacticsPenalty));
  }

  const { droids, tanks, cannons, constant } = power;
  return {
    droids: droids + droids * unitBonus,
    tanks: tanks + tanks * unitBonus,
    cannons: cannons + cannons * unitBonus,
    constant: constant + baseProtection,
  };
};

const getOptionalImprovedDroidsPower = (
  power: Power,
  building: Building,
  balance: GameBalanceConfig,
  player: Player
): Power => {
  if (!player.upgrades.includes('IMPROVED_DROIDS')) {
    return power;
  }
  const combatConfig = balance.upgrades.combat.balanceConfig;
  const bonus = isDefensive(building)
    ? combatConfig.improvedDroidsBaseAtTowerDefenceBonus
    : combatConfig.improvedDroidsBaseDefenceBonus;
  const { droids } = power;
  return {
    ...power,
    droids: droids + droids * bonus,
  };
};

const getOptionalImprovedTanksPower = (
  power: Power,
  balance: GameBalanceConfig,
  player: Player
): Power => {
  if (!player.upgrades.includes('IMPROVED_TANKS')) {
    return power;
  }
  const bonus = balance.upgrades.combat.balanceConfig.improvedTanksPowerBonus;
  const { tanks } = power;
  return {
    ...power,
    tanks: tanks + tanks * bonus,
  };
};

const getArmyBasePower = (army: Army, balance: GameBalanceConfig): Power => {
  return {
    droids: getUnitsBasePower(army.droids, 'DROID', balance),
    tanks: getUnitsBasePower(army.tanks, 'TANK', balance),
    cannons: getUnitsBasePower(army.cannons, 'CANNON', balance),
    constant: 0,
  };
};

const getUnitsBasePower = (
  amount: number,
  unitType: UnitType,
  balance: GameBalanceConfig
): number => {
  const config = unitTypeToConfig(balance.combat, unitType);
  const power = config.power;
  return amount * power;
};

export const calculateScarabsPower = (
  numberOfScarabs: number,
  balance: GameBalanceConfig,
  attacker: Player
): number => {
  const singleScarabPower = balance.combat.scarabs.power;
  const scarabsPower = numberOfScarabs * singleScarabPower;
  const attackerOwnsScarabScanners =
    attacker.upgrades.includes('SCARAB_SCANNERS');

  if (!attackerOwnsScarabScanners) {
    return scarabsPower;
  }

  const scarabScannersBonus =
    balance.upgrades.control.balanceConfig.scarabScannersPowerDecreaseRatio;
  const scarabsPowerRatio = 1 - scarabScannersBonus;
  return Math.round(scarabsPower * scarabsPowerRatio);
};

const isAdvancedTacticsApplicable = (attacker: Player, attackingArmy: Army) =>
  attacker.upgrades.includes('ADVANCED_TACTICS')
  && attackingArmy.droids > 0
  && attackingArmy.tanks > 0
  && attackingArmy.cannons > 0;
