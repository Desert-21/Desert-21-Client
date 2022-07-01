import { LabUpgrade } from '../models/game-models';
import { LabBranch, LabUpgradeConfig } from '../models/lab';

export const isBranchContainingUpgrade = (
  currentBranch: LabBranch,
  labUpgrade: LabUpgrade
): boolean => {
  const allUpgrades = [
    ...currentBranch.baseUpgrade.upgrades,
    ...currentBranch.tier1.upgrades,
    ...currentBranch.tier2.upgrades,
    ...currentBranch.superUpgrade.upgrades,
  ];
  return allUpgrades.some(u => u.logicalName === labUpgrade);
};
