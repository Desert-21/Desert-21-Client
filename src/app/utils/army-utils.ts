import {
  AllCombatBalance,
  GameBalanceConfig,
} from '../models/game-config-models';
import {
  Army,
  Building,
  Player,
  TrainingMode,
  UnitType,
} from '../models/game-models';
import { isDefensive } from './building-utils';

export const getFogOfWarCoefficient = (
  fogOfWarLevel: number,
  balance: GameBalanceConfig
): number | null => {
  switch (fogOfWarLevel) {
    case 1:
      return balance.general.fogOfWar1;
    case 2:
      return balance.general.fogOfWar2;
    default:
      return null;
  }
};

export type ArmyRange = {
  minArmy: Army;
  maxArmy: Army;
  isUnknown: boolean;
};

export const getArmyRanges = (
  fogOfWarLevel: number,
  balance: GameBalanceConfig,
  army: Army | null
): ArmyRange => {
  const coefficient = getFogOfWarCoefficient(fogOfWarLevel, balance);
  if (coefficient === null || army === null) {
    return {
      minArmy: { droids: 0, tanks: 0, cannons: 0 },
      maxArmy: { droids: 0, tanks: 0, cannons: 0 },
      isUnknown: true,
    };
  }
  const minArmy: Army = {
    droids: Math.round(army.droids * (1 - coefficient)),
    tanks: Math.round(army.tanks * (1 - coefficient)),
    cannons: Math.round(army.cannons * (1 - coefficient)),
  };
  const maxArmy: Army = {
    droids: Math.round(army.droids * (1 + coefficient)),
    tanks: Math.round(army.tanks * (1 + coefficient)),
    cannons: Math.round(army.cannons * (1 + coefficient)),
  };
  return {
    minArmy,
    maxArmy,
    isUnknown: false,
  };
};

export const canTrainUnits = (
  player: Player,
  building: Building,
  trainingMode: TrainingMode,
  unitType: UnitType
): boolean => {
  return (
    canTrainInMode(player, trainingMode) && canTrainUnitType(building, unitType)
  );
};

export const canTrainInMode = (
  player: Player,
  trainingMode: TrainingMode
): boolean => {
  const upgrades = player.upgrades;
  switch (trainingMode) {
    case 'SMALL_PRODUCTION':
      return true;
    case 'MEDIUM_PRODUCTION':
      return upgrades.includes('MEDIUM_PRODUCTION');
    case 'MASS_PRODUCTION':
      return upgrades.includes('MASS_PRODUCTION');
  }
};

export const canTrainUnitType = (
  building: Building,
  unitType: UnitType
): boolean => {
  const { level } = building;
  if (!isDefensive(building)) {
    return false;
  }
  switch (unitType) {
    case 'DROID':
      return true;
    case 'TANK':
      return level >= 2;
    case 'CANNON':
      return level >= 3;
  }
};

export const getFastestUnitsSpeed = (
  army: Army | null,
  balanceConfig: AllCombatBalance
): number => {
  if (army === null) {
    return 0;
  }
  const optionalDroidsBalance = army.droids > 0 ? balanceConfig.droids : null;
  const optionalTanksBalance = army.tanks > 0 ? balanceConfig.tanks : null;
  const optionalCannonsBalance =
    army.cannons > 0 ? balanceConfig.cannons : null;
  return [optionalDroidsBalance, optionalTanksBalance, optionalCannonsBalance]
    .filter((balance) => balance !== null)
    .map((balance) => balance.fieldsTraveledPerTurn)
    .reduce((prev, next) => {
      return next > prev ? next : prev;
    }, 0);
};
