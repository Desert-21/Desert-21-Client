import { FightingArmy } from './army-ranges';
import {
  Army,
  BoardLocation,
  BuildingType,
  LabUpgrade,
  ResourceSet,
  UnitType,
} from './game-models';

export type NotificationType =
  | 'BUILDING_UPGRADED'
  | 'RESOURCES_PRODUCED'
  | 'UNITS_TRAINED'
  | 'UNOCCUPIED_FIELD_ENEMY_CONQUEST_FAILED'
  | 'UNOCCUPIED_FIELD_PLAYERS_CONQUEST_FAILED'
  | 'UNOCCUPIED_FIELD_ENEMY_CONQUEST_SUCCEEDED'
  | 'UNOCCUPIED_FIELD_PLAYERS_CONQUEST_SUCCEEDED'
  | 'ENEMY_CONQUEST_FAILED'
  | 'PLAYERS_CONQUEST_FAILED'
  | 'ENEMY_CONQUEST_SUCCEEDED'
  | 'PLAYERS_CONQUEST_SUCCEEDED'
  | 'LAB_UPGRADE'
  | 'ROCKET_STRIKE'
  | 'ROCKET_STRIKE_DESTROYS_ROCKET_LAUNCHER'
  | 'BUILDING_BUILT'
  | 'PLAYER_BOMBARDING_SUCCEEDED'
  | 'ENEMY_BOMBARDING_SUCCEEDED'
  | 'PLAYER_BOMBARDING_FAILED'
  | 'ENEMY_BOMBARDING_FAILED';

export type AppNotification<T> = {
  type: NotificationType;
  content: T;
};

export interface NotificationHandler<T> {
  type: string;
  handle: (arg: T) => void;
}

export type NextTurnNotification = {
  currentPlayerId: string;
  timeout: string;
};

export type StartGameNotification = {
  gameId: string;
};

export type ResolutionPhaseNotification = {
  timeout: Date;
  notifications: Array<AppNotification<ResolutionPhaseNotificationContent>>;
};

export type ResolutionPhaseNotificationContent = {
  millisecondsToView: number;
};

export type ResourcesProducedNotification =
  ResolutionPhaseNotificationContent & {
    produced: ResourceSet;
    playerId: string;
  };

export type BuildingUpgradedNotification =
  ResolutionPhaseNotificationContent & {
    fromLevel: number;
    toLevel: number;
    location: BoardLocation;
  };

export type UnitsTrainedNotification = ResolutionPhaseNotificationContent & {
  location: BoardLocation;
  unitType: UnitType;
  amount: number;
};

export type LabUpgradeNotification = ResolutionPhaseNotificationContent & {
  upgrade: LabUpgrade;
  playerId: string;
};

export type BuildingBuiltNotification = ResolutionPhaseNotificationContent & {
  location: BoardLocation;
  buildingType: BuildingType;
};

export type FieldConquestAttackerOnlyNotification =
  ResolutionPhaseNotificationContent & {
    location: BoardLocation;
    attackersBefore: FightingArmy;
    attackersAfter: FightingArmy;
  };

export type FieldConquestFullPictureNotification =
  ResolutionPhaseNotificationContent & {
    location: BoardLocation;
    attackersBefore: FightingArmy;
    attackersAfter: FightingArmy;
    defendersBefore: FightingArmy;
    defendersAfter: FightingArmy;
  };

export type FieldConquestNoInfoNotification =
  ResolutionPhaseNotificationContent & {
    location: BoardLocation;
  };

export type RocketStrikeDestroysRocketLauncherNotification =
  ResolutionPhaseNotificationContent & {
    location: BoardLocation;
  };

export type RocketStrikeNotification = ResolutionPhaseNotificationContent & {
  location: BoardLocation;
  defendersBefore: Army;
  defendersAfter: Army;
};

export type BattleResult = {
  attackersBefore: FightingArmy;
  defendersBefore: FightingArmy;
  attackersAfter: FightingArmy;
  defendersAfter: FightingArmy;
  haveAttackersWon: boolean;
  wasUnoccupied: boolean;
};
