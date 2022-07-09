import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { LabAction } from 'src/app/models/actions';
import { ResourceSet } from 'src/app/models/game-models';
import { LabBranch, LabUpgradeConfig } from 'src/app/models/lab';
import { UpgradeSelectionService } from 'src/app/services/rx-logic/lab/upgrade-selection.service';
import { AvailableResourcesService } from 'src/app/services/rx-logic/shared/available-resources.service';
import { CurrentActionsService } from 'src/app/services/rx-logic/shared/current-actions.service';

@Component({
  selector: 'app-lab-upgrade-button',
  templateUrl: './lab-upgrade-button.component.html',
  styleUrls: ['./lab-upgrade-button.component.scss'],
})
export class LabUpgradeButtonComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line: variable-name
  private _selectedBranch: LabBranch;
  labUpgrade: LabUpgradeConfig;

  availableResources: ResourceSet = {
    metal: 0,
    buildingMaterials: 0,
    electricity: 0,
  };

  isDisabled = true;

  private sub1: Subscription;

  private selectedBranchSubject = new Subject<LabBranch>();

  constructor(
    private currentActionsService: CurrentActionsService,
    private availableResourcesService: AvailableResourcesService,
    private upgradeSelectionService: UpgradeSelectionService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.availableResourcesService.getStateUpdates(),
      this.getBranchObservable(),
      this.upgradeSelectionService.getStateUpdates(),
    ]).subscribe((updates) => {
      const [resources, branch, upgrade] = updates;
      this.availableResources = resources;
      this._selectedBranch = branch;
      this.labUpgrade = upgrade;
      this.updateDisabled();
    });
    this.availableResourcesService.requestState();
  }

  performLabUpgrade(upgradeConfig: LabUpgradeConfig): void {
    const cost = upgradeConfig.cost;
    const upgrade = upgradeConfig.logicalName;
    const action = new LabAction(upgrade, cost);
    this.currentActionsService.pushAction(action);
  }

  updateDisabled(): void {
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

  getBranchObservable(): Observable<LabBranch> {
    return this.selectedBranchSubject.asObservable();
  }

  get selectedBranch(): LabBranch {
    return this._selectedBranch;
  }

  @Input()
  set selectedBranch(selection: LabBranch) {
    this.selectedBranchSubject.next(selection);
  }
}
