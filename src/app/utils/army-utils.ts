import { ArmyDescription } from '../components/game-view/right-panel/army-preview/army-preview-state';
import {
  AttackAction,
  BombardAction,
  MoveUnitsAction,
  PlayersAction,
} from '../models/actions';
import { EstimatedArmy, FightingArmy } from '../models/army-ranges';
import {
  AllCombatBalance,
  GameBalanceConfig,
  ScarabConfig,
} from '../models/game-config-models';
import {
  Army,
  BoardLocation,
  Building,
  Player,
  ResourceSet,
  TrainingMode,
  UnitType,
} from '../models/game-models';
import { trainingModeToAmount, unitTypeToConfig } from './balance-utils';
import { isDefensive } from './building-utils';
import { areLocationsEqual } from './location-utils';
import {
  ExplainedAvailability,
  getAvailable,
  getNotAvailable,
} from './validation';

export type AllUnitTypes = UnitType | 'SCARAB';

export const getUnitImage = (unitType: AllUnitTypes): string => {
  switch (unitType) {
    case 'DROID':
      return '/assets/mechs/droid.png';
    case 'TANK':
      return '/assets/mechs/tank.png';
    case 'CANNON':
      return '/assets/mechs/cannon.png';
    case 'SCARAB':
      return '/assets/mechs/scarab.png';
  }
};

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
  const coefficient = getFogOfWarCoefficient(fogOfWarLevel, balance) / 100;
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

export const getHostileArmyEstimation = (
  fogOfWarLevel: number,
  balance: GameBalanceConfig,
  army: Army | null,
  player: Player,
  scarabsRange: ScarabsRange
): EstimatedArmy => {
  const coefficient = getFogOfWarCoefficient(fogOfWarLevel, balance) / 100;
  if (coefficient === null || army === null) {
    return new EstimatedArmy(
      'ENEMY',
      false,
      { droids: 0, tanks: 0, cannons: 0, scarabs: 0 },
      { droids: 0, tanks: 0, cannons: 0, scarabs: 0 },
      { droids: 0, tanks: 0, cannons: 0, scarabs: 0 }
    );
  }
  const hasDefensiveScarabs = player.upgrades.includes('KING_OF_DESERT');
  const scarabRange: ScarabsRange = hasDefensiveScarabs
    ? scarabsRange
    : { min: 0, avg: 0, max: 0 };
  const minArmy: FightingArmy = {
    droids: Math.round(army.droids * (1 - coefficient)),
    tanks: Math.round(army.tanks * (1 - coefficient)),
    cannons: Math.round(army.cannons * (1 - coefficient)),
    scarabs: scarabRange.min,
  };
  const avgArmy: FightingArmy = {
    droids: army.droids,
    tanks: army.tanks,
    cannons: army.cannons,
    scarabs: scarabRange.avg,
  };
  const maxArmy: FightingArmy = {
    droids: Math.round(army.droids * (1 + coefficient)),
    tanks: Math.round(army.tanks * (1 + coefficient)),
    cannons: Math.round(army.cannons * (1 + coefficient)),
    scarabs: scarabRange.max,
  };
  return new EstimatedArmy('ENEMY', true, minArmy, avgArmy, maxArmy);
};

export const canTrainUnits = (
  player: Player,
  building: Building,
  trainingMode: TrainingMode,
  unitType: UnitType,
  availableResources: ResourceSet,
  balance: GameBalanceConfig
): ExplainedAvailability => {
  if (!canTrainInMode(player, trainingMode)) {
    return getNotAvailable(
      'You need to unlock this production mode in the lab.'
    );
  }
  if (!canTrainUnitType(building, unitType)) {
    return getNotAvailable(
      'You need to upgrade your tower in order to train this unit.'
    );
  }
  if (!canAffordUnits(availableResources, unitType, trainingMode, balance)) {
    return getNotAvailable("You don't have enough metal.");
  }
  return getAvailable();
};

export const canAffordUnits = (
  availableResources: ResourceSet,
  unitType: UnitType,
  trainingMode: TrainingMode,
  balance: GameBalanceConfig
): boolean => {
  const unitConfig = unitTypeToConfig(balance.combat, unitType);
  const amount = trainingModeToAmount(trainingMode, unitConfig);
  const unitCost = unitConfig.cost;
  return availableResources.metal >= amount * unitCost;
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

export const getSlowestUnitsSpeed = (
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
      return next < prev ? next : prev;
    }, Infinity);
};

export const getArrivingBackupAtLocation = (
  location: BoardLocation,
  actions: Array<PlayersAction<any>>
): Army => {
  return actions
    .filter((a) => a.getType() === 'MOVE_UNITS')
    .map((a) => a as MoveUnitsAction)
    .filter((a) => areLocationsEqual(a.to, location))
    .map((a) => a.army)
    .reduce(sumArmies, { droids: 0, tanks: 0, cannons: 0 });
};

export const getOnlyArmyMovementFrozenUnitsAtLocation = (
  location: BoardLocation,
  actions: Array<PlayersAction<any>>
): Army => {
  return actions
    .filter((a) => ['MOVE_UNITS', 'ATTACK'].includes(a.getType()))
    .map((a) => a as MoveUnitsAction)
    .filter((a) => areLocationsEqual(a.from, location))
    .map((a) => a.army)
    .reduce(sumArmies, { droids: 0, tanks: 0, cannons: 0 });
};

export const getFrozenUnitsAtLocation = (
  location: BoardLocation,
  actions: Array<PlayersAction<any>>
): Army => {
  const fromArmyMovements = getOnlyArmyMovementFrozenUnitsAtLocation(
    location,
    actions
  );
  const fromBombardings = actions
    .filter((a) => a.getType() === 'BOMBARD')
    .map((a) => a as BombardAction)
    .filter((a) => areLocationsEqual(a.from, location))
    .map((a) => {
      return { droids: 0, tanks: 0, cannons: a.cannonsAmount } as Army;
    })
    .reduce(sumArmies, { droids: 0, tanks: 0, cannons: 0 });
  return sumArmies(fromArmyMovements, fromBombardings);
};

export const getNextTurnMovedUnitsAtLocation = (
  location: BoardLocation,
  actions: Array<PlayersAction<any>>
): Army => {
  const frozenUnits = getFrozenUnitsAtLocation(location, actions);
  const incomingUnits = actions
    .filter((a) => a.getType() === 'MOVE_UNITS')
    .map((a) => a as MoveUnitsAction)
    .filter((a) => areLocationsEqual(a.to, location))
    .map((a) => a.army)
    .reduce(sumArmies, { droids: 0, tanks: 0, cannons: 0 });
  return subtractArmies(incomingUnits, frozenUnits);
};

export const getNextTurnAttackingUnitsAtLocation = (
  location: BoardLocation,
  actions: Array<PlayersAction<any>>
): Army => {
  return actions
    .filter((a) => a.getType() === 'ATTACK')
    .map((a) => a as AttackAction)
    .filter((a) => areLocationsEqual(a.to, location))
    .map((a) => a.army)
    .reduce(sumArmies, { droids: 0, tanks: 0, cannons: 0 });
};

export const sumArmies = (army1: Army, army2: Army): Army => {
  return {
    droids: army1.droids + army2.droids,
    tanks: army1.tanks + army2.tanks,
    cannons: army1.cannons + army2.cannons,
  };
};

export const subtractArmies = (army1: Army, army2: Army): Army => {
  return {
    droids: army1.droids - army2.droids,
    tanks: army1.tanks - army2.tanks,
    cannons: army1.cannons - army2.cannons,
  };
};

export type ScarabsRange = {
  min: number;
  avg: number;
  max: number;
};

export const getScarabsRange = (
  turnNumber: number,
  config: ScarabConfig
): ScarabsRange => {
  const middleScarabsNumber =
    config.baseGeneration + turnNumber * config.additionalGenerationPerTurn;
  const minScarabs = Math.round(
    middleScarabsNumber * (1 - config.generationBias)
  );
  const maxScarabs = Math.round(
    middleScarabsNumber * (1 + config.generationBias)
  );
  return {
    min: minScarabs,
    avg: middleScarabsNumber,
    max: maxScarabs,
  };
};

export const getUnitDamageDescription = (
  before: number,
  after: number
): string => {
  return after - before !== 0 ? `${after - before}` : '';
};

export const getArmyDamageDescription = (
  before: Army,
  after: Army
): ArmyDescription => {
  return {
    droids:
      after.droids - before.droids !== 0
        ? `${after.droids - before.droids}`
        : '',
    tanks:
      after.tanks - before.tanks !== 0 ? `${after.tanks - before.tanks}` : '',
    cannons:
      after.cannons - before.cannons !== 0
        ? `${after.cannons - before.cannons}`
        : '',
  };
};

export const getFightingArmyDamageDescription = (
  before: FightingArmy,
  after: FightingArmy
): ArmyDescription => {
  return {
    droids:
      after.droids - before.droids !== 0
        ? `${after.droids - before.droids}`
        : '',
    tanks:
      after.tanks - before.tanks !== 0 ? `${after.tanks - before.tanks}` : '',
    cannons:
      after.cannons - before.cannons !== 0
        ? `${after.cannons - before.cannons}`
        : '',
    scarabs:
      after.scarabs - before.scarabs !== 0
        ? `${after.scarabs - before.scarabs}`
        : '',
  };
};

export const armyToArmyDescription = (army: Army): ArmyDescription => {
  return {
    droids: army.droids.toString(),
    tanks: army.tanks.toString(),
    cannons: army.cannons.toString(),
  };
};

export const fightingArmyToArmyDescription = (
  army: FightingArmy
): ArmyDescription => {
  return {
    droids: army.droids.toString(),
    tanks: army.tanks.toString(),
    cannons: army.cannons.toString(),
    scarabs: army.scarabs.toString(),
  };
};
