import { Injectable } from '@angular/core';
import { LabAction, PlayersAction } from 'src/app/models/actions';
import { LabUpgrade } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import { LabBranch, LabBranchTier, LabConfig } from 'src/app/models/lab';
import { isBranchContainingUpgrade } from 'src/app/utils/lab-utils';
import { GameContextService } from '../shared/game-context.service';
import { ResourceProcessor } from '../templates/resource-processor';
import { UpgradesConfigService } from './upgrades-config.service';

@Injectable({
  providedIn: 'root',
})
export class UpgradesWithContextService extends ResourceProcessor<LabConfig> {
  constructor(
    private upgradesConfigService: UpgradesConfigService,
    private gameContextService: GameContextService
  ) {
    super([upgradesConfigService, gameContextService]);
  }

  protected processData(dataElements: any[]): LabConfig {
    const [labConfig, context] = dataElements as [LabConfig, GameContext];
    const upgrades = context.player.upgrades;
    this.enrichWithTiersInfo(labConfig, upgrades);
    this.enrichBranchesWithBranchIsAlreadyUpgrading(
      labConfig,
      context.currentActions
    );
    this.enrichLabUpgradeConfigs(labConfig, context.currentActions, upgrades);

    return labConfig;
  }

  private enrichWithTiersInfo(
    labConfig: LabConfig,
    upgrades: Array<LabUpgrade>
  ): void {
    const branches = [
      labConfig.combat,
      labConfig.control,
      labConfig.production,
    ];
    for (const branch of branches) {
      const tiers = [
        branch.baseUpgrade,
        branch.tier1,
        branch.tier2,
        branch.superUpgrade,
      ];
      this.enrichTiersWithIsCompleted(tiers, upgrades);
      this.enrichTiersWithIsLocked(tiers, upgrades);
      tiers.forEach(this.enrichTierUpgradesWithTierIsLockedInfo);
    }
  }

  private enrichTiersWithIsCompleted(
    tiers: Array<LabBranchTier>,
    upgrades: Array<LabUpgrade>
  ): void {
    tiers.forEach((t) => {
      const requiredUpgrades = t.upgrades.map((u) => u.logicalName);
      const hasAllUpgrades = requiredUpgrades.every((u) =>
        upgrades.includes(u)
      );
      t.isCompleted = hasAllUpgrades;
    });
  }

  private enrichTiersWithIsLocked(
    tiers: Array<LabBranchTier>,
    upgrades: Array<LabUpgrade>
  ): void {
    let first: LabBranchTier | null = null;
    let second = tiers[0];
    let index = 0;
    do {
      if (first === null) {
        second.isLocked = false;
      } else if (first.upgrades.some((u) => upgrades.includes(u.logicalName))) {
        second.isLocked = false;
      } else {
        second.isLocked = true;
      }

      index++;
      first = tiers[index - 1];
      second = tiers[index];
    } while (index < tiers.length);
  }

  private enrichTierUpgradesWithTierIsLockedInfo(tier: LabBranchTier): void {
    tier.upgrades.forEach((u) => {
      u.isTierLocked = tier.isLocked;
    });
  }

  private enrichBranchesWithBranchIsAlreadyUpgrading(
    labConfig: LabConfig,
    currentActions: Array<PlayersAction<any>>
  ): void {
    const branches = [
      labConfig.combat,
      labConfig.control,
      labConfig.production,
    ];
    const labActions = currentActions.filter(
      (a) => a.getType() === 'LAB_EVENT'
    ) as Array<LabAction>;
    const currentlyUpgraded = labActions.map((a) => a.upgrade);
    branches.forEach((branch) => {
      const isBranchUpgraded = currentlyUpgraded.some((upgrade) =>
        isBranchContainingUpgrade(branch, upgrade)
      );
      branch.isAlreadyUpgrading = isBranchUpgraded;
    });
  }

  private enrichLabUpgradeConfigs(
    labConfig: LabConfig,
    currentActions: Array<PlayersAction<any>>,
    ownedUpgrades: Array<LabUpgrade>
  ): void {
    const labActions = currentActions.filter(
      (a) => a.getType() === 'LAB_EVENT'
    ) as Array<LabAction>;
    const currentlyUpgraded = labActions.map((a) => a.upgrade);
    const upgradeConfigs = [
      labConfig.combat,
      labConfig.control,
      labConfig.production,
    ]
      .map((branch) => {
        return [
          branch.baseUpgrade,
          branch.tier1,
          branch.tier2,
          branch.superUpgrade,
        ].map((t) => t.upgrades);
      })
      .reduce((prev, next) => {
        return [...prev, ...next];
      }, [])
      .reduce((prev, next) => {
        return [...prev, ...next];
      }, []);
    upgradeConfigs.forEach((upgradeConfig) => {
      upgradeConfig.isCurrentlyUpgrading = currentlyUpgraded.some(
        (u) => u === upgradeConfig.logicalName
      );
      upgradeConfig.isAlreadyUpgraded = ownedUpgrades.some(
        (u) => u === upgradeConfig.logicalName
      );
    });
  }
}
