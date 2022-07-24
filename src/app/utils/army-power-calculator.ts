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
): number => {
  return calculateDefendingArmyPower(
    army,
    army.scarabs,
    balance,
    defender,
    attacker,
    building
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
  const totalPreAdvancedTacticsArmyPower =
    postImprovedTanksPower.droids +
    postImprovedTanksPower.tanks +
    postImprovedTanksPower.cannons +
    postImprovedTanksPower.constant;
  return Math.round(
    getOptionalAdvancedTacticsPower(
      totalPreAdvancedTacticsArmyPower,
      balance,
      attacker
    )
  );
};

export const calculateDefendingArmyPower = (
  army: Army, // base army
  scarabs: number, // are we generating some scarabs?
  balance: GameBalanceConfig, // reference to balance
  defender: Player, // mainly for upgrades, but who knows...
  attacker: Player,
  building: Building // for tower bonuses, etc.
): number => {
  const basePower = getArmyBasePower(army, balance);
  const postTowerPower = getOptionalTowerPowerBonuses(
    basePower,
    building,
    balance
  );
  const postFactoryTurretPower = getOptionalFactoryPowerBonuses(
    postTowerPower,
    building,
    balance,
    defender
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
  const totalPreAdvancedTacticsArmyPower =
    postImprovedTanksPower.droids +
    postImprovedTanksPower.tanks +
    postImprovedTanksPower.cannons +
    postImprovedTanksPower.constant;
  const postAdvancedTacticsPower = getOptionalAdvancedTacticsPower(
    totalPreAdvancedTacticsArmyPower,
    balance,
    defender
  );
  return Math.round(getOptionalScarabsPowerBonuses(
    postAdvancedTacticsPower,
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
  balance: GameBalanceConfig
): Power => {
  if (!isDefensive(building)) {
    return power;
  }
  const config = buildingToConfig(balance.buildings, building) as TowerConfig;
  const baseProtection = getLeveledValueByLevel(
    config.baseProtection,
    building.level
  );
  const unitBonus = getLeveledValueByLevel(config.unitBonus, building.level);
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
  player: Player
): Power => {
  if (!isFactory(building)) {
    return power;
  }
  if (!player.upgrades.includes('FACTORY_TURRET')) {
    return power;
  }
  const towerConfig = balance.buildings.tower;
  const towerLevel =
    balance.upgrades.control.balanceConfig.factoryTurretTowerLevel;
  const baseProtection = getLeveledValueByLevel(
    towerConfig.baseProtection,
    towerLevel
  );
  const unitBonus = getLeveledValueByLevel(towerConfig.unitBonus, towerLevel);
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

const getOptionalAdvancedTacticsPower = (
  totalPower: number,
  balance: GameBalanceConfig,
  player: Player
): number => {
  if (!player.upgrades.includes('ADVANCED_TACTICS')) {
    return totalPower;
  }
  const combatConfig = balance.upgrades.combat.balanceConfig;
  const step = combatConfig.advancedTacticsReferencePower;
  const bonusPerStep = combatConfig.advancedTacticsPowerBonusPerReferencePower;
  const totalSteps = Math.floor(totalPower / step);
  const totalBonusRatio = totalSteps * bonusPerStep;
  return totalPower + totalPower * totalBonusRatio;
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
