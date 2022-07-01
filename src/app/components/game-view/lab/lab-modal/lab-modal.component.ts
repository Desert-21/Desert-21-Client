import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { LabBranch, LabConfig, LabUpgradeConfig } from 'src/app/models/lab';
import { SelectedUpgradeService } from 'src/app/services/rx-logic/lab/selected-upgrade.service';
import { UpgradesWithContextService } from 'src/app/services/rx-logic/lab/upgrades-with-context.service';
import { capitalize } from 'src/app/utils/text-utils';

type Branch = 'combat' | 'control' | 'production';

@Component({
  selector: 'app-lab-modal',
  templateUrl: './lab-modal.component.html',
  styleUrls: ['./lab-modal.component.scss'],
})
export class LabModalComponent implements OnInit, OnDestroy {
  labConfig: LabConfig;
  currentBranch: LabBranch = {
    isAlreadyUpgrading: false,
    baseUpgrade: {
      isLocked: true,
      isCompleted: false,
      upgrades: [],
    },
    tier1: {
      isLocked: true,
      isCompleted: false,
      upgrades: [],
    },
    tier2: {
      isLocked: true,
      isCompleted: false,
      upgrades: [],
    },
    superUpgrade: {
      isLocked: true,
      isCompleted: false,
      upgrades: [],
    },
  };
  labUpgrade: LabUpgradeConfig = {
    isAlreadyUpgraded: false,
    isCurrentlyUpgrading: false,
    isTierLocked: false,
    title: '',
    imagePath: '/assets/buildings/electricity.png',
    cost: 0,
    logicalName: 'ADVANCED_TACTICS',
  };

  branchTitle = '';

  @Input() modal: any;

  private sub1: Subscription;
  private sub2: Subscription;

  private branchSubject = new Subject<Branch>();

  constructor(
    private upgradesWithContextService: UpgradesWithContextService,
    private selectedUpgradeService: SelectedUpgradeService
  ) {}

  ngOnInit(): void {
    this.sub1 = combineLatest([
      this.upgradesWithContextService.getStateUpdates(),
      this.getBranchSelectionObservable(),
    ]).subscribe((upgradesData) => {
      const [labConfig, branch] = upgradesData;
      this.labConfig = labConfig;
      this.currentBranch = labConfig[branch];
      this.branchTitle = capitalize(branch);
    });
    this.sub2 = this.selectedUpgradeService
      .getStateUpdates()
      .subscribe((upgrade) => {
        this.labUpgrade = upgrade;
      });

    this.selectBranch('combat');
    this.upgradesWithContextService.requestState();
    this.selectedUpgradeService.requestState();
  }

  getBranchSelectionObservable(): Observable<Branch> {
    return this.branchSubject.asObservable();
  }

  selectBranch(branch: Branch): void {
    this.branchSubject.next(branch);
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }
}
