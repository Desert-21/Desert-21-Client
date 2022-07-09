import { Injectable } from '@angular/core';
import { LabUpgrade } from 'src/app/models/game-models';
import {
  LabBranch,
  LabBranchTier,
  LabConfig,
  LabUpgradeConfig,
} from 'src/app/models/lab';
import { ResourceProcessor } from '../templates/resource-processor';
import { SelectedUpgradeService } from './selected-upgrade.service';
import { UpgradesWithContextService } from './upgrades-with-context.service';

@Injectable({
  providedIn: 'root',
})
export class UpgradeSelectionService extends ResourceProcessor<LabUpgradeConfig | null> {
  constructor(
    private upgradesWithContextService: UpgradesWithContextService,
    private selectedUpgradeService: SelectedUpgradeService
  ) {
    super([upgradesWithContextService, selectedUpgradeService]);
  }

  protected processData(dataElements: any[]): LabUpgradeConfig {
    const [labConfig, selectedUpgrade] = dataElements as [
      LabConfig,
      LabUpgrade
    ];
    return [labConfig.combat, labConfig.control, labConfig.production]
      .map(this.branchToTiers)
      .reduce((prev, next) => [...prev, ...next])
      .map((tier) => tier.upgrades)
      .reduce((prev, next) => [...prev, ...next])
      .find((upgrade) => upgrade.logicalName === selectedUpgrade);
  }

  private branchToTiers(branch: LabBranch): Array<LabBranchTier> {
    return [
      branch.baseUpgrade,
      branch.tier1,
      branch.tier2,
      branch.superUpgrade,
    ];
  }
}
