import { Injectable } from '@angular/core';
import { Branch, GameBalanceConfig } from 'src/app/models/game-config-models';
import { LabUpgrade } from 'src/app/models/game-models';
import { LabBranch, LabConfig, LabUpgradeConfig } from 'src/app/models/lab';
import { labUpgradeToImagePath } from 'src/app/utils/lab-utils';
import {
  underscoreToLowerCamelCase,
  underscoreToRegular,
} from 'src/app/utils/text-utils';
import { GameBalanceService } from '../../http/game-balance.service';
import { ResourceProcessor } from '../templates/resource-processor';

type UnknownBranch = Branch & {
  costConfig: any;
};

@Injectable({
  providedIn: 'root',
})
export class UpgradesConfigService extends ResourceProcessor<LabConfig> {
  constructor(private gameBalanceService: GameBalanceService) {
    super([gameBalanceService]);
  }

  protected processData(dataElements: any[]): LabConfig {
    const [balance] = dataElements as [GameBalanceConfig];
    const upgradesConfig = balance.upgrades;
    const branches = [
      upgradesConfig.combat,
      upgradesConfig.control,
      upgradesConfig.production,
    ] as Array<UnknownBranch>;
    const [combat, control, production] = branches.map(branchToBranchConfig);
    return {
      combat,
      control,
      production,
    };
  }
}

const branchToBranchConfig = (branch: UnknownBranch): LabBranch => {
  const costConfig = branch.costConfig;
  upgradesToUpgradesConfig([], costConfig);

  const baseUpgrade = {
    isLocked: false,
    isCompleted: false,
    upgrades: upgradesToUpgradesConfig([branch.baseUpgrade], costConfig),
  };
  const tier1 = {
    isLocked: false,
    isCompleted: false,
    upgrades: upgradesToUpgradesConfig(branch.firstTierUpgrades, costConfig),
  };
  const tier2 = {
    isLocked: false,
    isCompleted: false,
    upgrades: upgradesToUpgradesConfig(branch.secondTierUpgrades, costConfig),
  };
  const superUpgrade = {
    isLocked: false,
    isCompleted: false,
    upgrades: upgradesToUpgradesConfig([branch.superUpgrade], costConfig),
  };
  const isAlreadyUpgrading = false;

  return {
    baseUpgrade,
    tier1,
    tier2,
    superUpgrade,
    isAlreadyUpgrading,
  };
};

const getCost = (labUpgrade: LabUpgrade, costConfig: any): number => {
  const fieldName = underscoreToLowerCamelCase(labUpgrade);
  return costConfig[fieldName];
};

const getUpgradeTitle = (labUpgrade: LabUpgrade): string => {
  return underscoreToRegular(labUpgrade);
};

const getImagePath = (labUpgrade: LabUpgrade): string => {
  return labUpgradeToImagePath(labUpgrade);
};

const upgradesToUpgradesConfig = (
  upgrades: Array<LabUpgrade>,
  costConfig: any
): Array<LabUpgradeConfig> => {
  return upgrades.map((u) => {
    const cost = getCost(u, costConfig);
    const title = getUpgradeTitle(u);
    const imagePath = getImagePath(u);
    const isAlreadyUpgraded = false;
    const isCurrentlyUpgrading = false;
    const isTierLocked = false;
    return {
      cost,
      title,
      imagePath,
      isAlreadyUpgraded,
      isCurrentlyUpgrading,
      logicalName: u,
      isTierLocked,
    };
  });
};
