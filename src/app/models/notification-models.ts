import { FightingArmy } from './army-ranges';
import {
  Army,
  BoardLocation,
  BuildingType,
  LabUpgrade,
  ResourceSet,
} from './game-models';

export type AppNotification<T> = {
  type: string;
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
