import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { LabAction } from 'src/app/models/actions';
import { ResourceSet } from 'src/app/models/game-models';
import { LabBranch, LabUpgradeConfig } from 'src/app/models/lab';
import { AvailableResourcesService } from 'src/app/services/rx-logic/shared/available-resources.service';
import { CurrentActionsService } from 'src/app/services/rx-logic/shared/current-actions.service';

@Component({
  selector: 'app-lab-upgrade-button',
  templateUrl: './lab-upgrade-button.component.html',
  styleUrls: ['./lab-upgrade-button.component.scss'],
})
export class LabUpgradeButtonComponent implements OnInit, OnChanges, OnDestroy {
  @Input() selectedBranch: LabBranch;
  @Input() labUpgrade: LabUpgradeConfig;

  availableResources: ResourceSet = {
    metal: 0,
    buildingMaterials: 0,
    electricity: 0,
  };

  isDisabled = true;

  private sub1: Subscription;

  constructor(
    private currentActionsService: CurrentActionsService,
    private availableResourcesService: AvailableResourcesService
  ) {}

  ngOnInit(): void {
    this.sub1 = this.availableResourcesService
      .getStateUpdates()
      .subscribe((resources) => {
        this.availableResources = resources;
        this.ngOnChanges(null);
      });
    this.availableResourcesService.requestState();
  }

  performLabUpgrade(upgradeConfig: LabUpgradeConfig): void {
    const cost = upgradeConfig.cost;
    const upgrade = upgradeConfig.logicalName;
    const action = new LabAction(upgrade, cost);
    this.currentActionsService.pushAction(action);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.labUpgrade, this.selectedBranch, this.availableResources);
    this.isDisabled =
      this.labUpgrade?.isCurrentlyUpgrading ||
      this.labUpgrade?.isAlreadyUpgraded ||
      this.labUpgrade?.isTierLocked ||
      this.selectedBranch?.isAlreadyUpgrading ||
      this.availableResources.electricity < this.labUpgrade?.cost;
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
