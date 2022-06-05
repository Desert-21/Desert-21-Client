import { GameBalanceConfig } from '../models/game-config-models';
import { Army } from '../models/game-models';

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
