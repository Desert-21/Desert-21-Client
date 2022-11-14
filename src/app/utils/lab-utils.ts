import { LabUpgrade } from '../models/game-models';
import { LabBranch } from '../models/lab';
import { underscoreToKebabCase } from './text-utils';

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
  if (labUpgrade === 'PRODUCTION_AI') {
    return '/assets/buildings/resources/electricity.png';
  }
  return `/assets/upgrades/${underscoreToKebabCase(labUpgrade)}.jpg`;
};
