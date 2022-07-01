import { LabUpgrade } from './game-models';

export type LabConfig = {
  combat: LabBranch;
  control: LabBranch;
  production: LabBranch;
};

export type LabBranch = {
  isAlreadyUpgrading: boolean;
  baseUpgrade: LabBranchTier;
  tier1: LabBranchTier;
  tier2: LabBranchTier;
  superUpgrade: LabBranchTier;
};

export type LabBranchTier = {
  isLocked: boolean;
  isCompleted;
  upgrades: Array<LabUpgradeConfig>;
};

export type LabUpgradeConfig = {
  isAlreadyUpgraded: boolean;
  isCurrentlyUpgrading: boolean;
  isTierLocked: boolean;
  title: string;
  imagePath: string;
  cost: number;
  logicalName: LabUpgrade;
};
