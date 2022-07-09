import { Component, Input, OnInit } from '@angular/core';
import { LabBranchTier, LabUpgradeConfig } from 'src/app/models/lab';
import { SelectedUpgradeService } from 'src/app/services/rx-logic/lab/selected-upgrade.service';

@Component({
  selector: 'app-lab-tier-view',
  templateUrl: './lab-tier-view.component.html',
  styleUrls: ['./lab-tier-view.component.scss'],
})
export class LabTierViewComponent implements OnInit {
  @Input() tierName: string;
  @Input() tier: LabBranchTier;

  constructor(private selectedUpgradeService: SelectedUpgradeService) {}

  ngOnInit(): void {}

  selectLabUpgrade(upgradeConfig: LabUpgradeConfig): void {
    this.selectedUpgradeService.set(upgradeConfig.logicalName);
  }
}
