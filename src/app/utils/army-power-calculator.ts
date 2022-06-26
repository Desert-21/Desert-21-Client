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

export const calculateFightingArmyPower = (
  army: FightingArmy, // base army
  balance: GameBalanceConfig, // reference to balance
  player: Player, // mainly for upgrades, but who knows...
  building: Building, // for tower bonuses, etc.
  isDefending: boolean // is defending, or attacking power?
): number => {
  const basePower = getArmyBasePower(army, balance);
  const postTowerPower = getOptionalTowerPowerBonuses(
    basePower,
    isDefending,
    building,
    balance
  );
  const postFactoryTurretPower = getOptionalFactoryPowerBonuses(
    postTowerPower,
    isDefending,
    building,
    balance,
    player
  );
  const postImprovedDroidsPower = getOptionalImprovedDroidsPower(
    postFactoryTurretPower,
    isDefending,
    building,
    balance,
    player
  );
  const postImprovedTanksPower = getOptionalImprovedTanksPower(
    postImprovedDroidsPower,
    balance,
    player
  );
  const totalPreAdvancedTacticsArmyPower =
    postImprovedTanksPower.droids +
    postImprovedTanksPower.tanks +
    postImprovedTanksPower.cannons +
    postImprovedTanksPower.constant;
  return getOptionalAdvancedTacticsPower(
    totalPreAdvancedTacticsArmyPower,
    balance,
    player
  );
};

export const calculateArmyPower = (
  army: Army, // base army
  scarabs: number, // are we generating some scarabs?
  balance: GameBalanceConfig, // reference to balance
  player: Player, // mainly for upgrades, but who knows...
  building: Building, // for tower bonuses, etc.
  isDefending: boolean // is defending, or attacking power?
): number => {
  const basePower = getArmyBasePower(army, balance);
  const postTowerPower = getOptionalTowerPowerBonuses(
    basePower,
    isDefending,
    building,
    balance
  );
  const postFactoryTurretPower = getOptionalFactoryPowerBonuses(
    postTowerPower,
    isDefending,
    building,
    balance,
    player
  );
  const postImprovedDroidsPower = getOptionalImprovedDroidsPower(
    postFactoryTurretPower,
    isDefending,
    building,
    balance,
    player
  );
  const postImprovedTanksPower = getOptionalImprovedTanksPower(
    postImprovedDroidsPower,
    balance,
    player
  );
  const totalPreAdvancedTacticsArmyPower =
    postImprovedTanksPower.droids +
    postImprovedTanksPower.tanks +
    postImprovedTanksPower.cannons +
    postImprovedTanksPower.constant;
  return getOptionalAdvancedTacticsPower(
    totalPreAdvancedTacticsArmyPower,
    balance,
    player
  );
};

const getOptionalTowerPowerBonuses = (
  power: Power,
  isDefending: boolean,
  building: Building,
  balance: GameBalanceConfig
): Power => {
  if (!isDefending) {
    return power;
  }
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
  isDefending: boolean,
  building: Building,
  balance: GameBalanceConfig,
  player: Player
): Power => {
  if (!isDefending) {
    return power;
  }
  if (!isFactory(building)) {
    return power;
  }
  if (!player.upgrades.includes('FACTORY_TURRET')) {
    return power;
  }
  const towerConfig = balance.buildings.tower;
  const towerLevel =
    balance.upgrades.control.controlBranchConfig.factoryTurretTowerLevel;
  const baseProtection = getLeveledValueByLevel(
    towerConfig.baseProtection,
    towerLevel
  );
  const unitBonus = getLeveledValueByLevel(
    towerConfig.baseProtection,
    towerLevel
  );
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
  isDefending: boolean,
  building: Building,
  balance: GameBalanceConfig,
  player: Player
): Power => {
  if (!isDefending) {
    return power;
  }
  if (!player.upgrades.includes('IMPROVED_DROIDS')) {
    return power;
  }
  const combatConfig = balance.upgrades.combat.combatBranchConfig;
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
  const bonus =
    balance.upgrades.combat.combatBranchConfig.improvedTanksPowerBonus;
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
  const combatConfig = balance.upgrades.combat.combatBranchConfig;
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
