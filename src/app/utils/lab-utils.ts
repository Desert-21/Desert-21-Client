import { LabUpgrade } from '../models/game-models';
import { LabBranch } from '../models/lab';

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
  return allUpgrades.some((u) => u.logicalName === labUpgrade);
};

export const labUpgradeToImagePath = (labUpgrade: LabUpgrade): string => {
  switch (labUpgrade) {
    case 'FACTORY_TURRET':
      return '/assets/upgrades/factory-turret.jpg';
    default:
      return '/assets/buildings/electricity.png';
  }
};
