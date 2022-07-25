import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FireRocketAction } from 'src/app/models/actions';
import { BoardLocation } from 'src/app/models/game-models';
import { CanDestroyRocketService } from 'src/app/services/rx-logic/double-field-selection/can-destroy-rocket.service';
import { DoubleFieldSelectionService } from 'src/app/services/rx-logic/double-field-selection/double-field-selection.service';
import { RocketAlreadyFiredService } from 'src/app/services/rx-logic/double-field-selection/rocket-already-fired.service';
import { RocketAvailabilityService } from 'src/app/services/rx-logic/double-field-selection/rocket-availability.service';
import {
  RocketStrikeCostDescription,
  RocketStrikeCostService,
} from 'src/app/services/rx-logic/double-field-selection/rocket-strike-cost.service';
import { CurrentActionsService } from 'src/app/services/rx-logic/shared/current-actions.service';
import { ExplainedAvailability, getNotAvailable } from 'src/app/utils/validation';
import { ArmyDescription } from '../../right-panel/army-preview/army-preview-state';

@Component({
  selector: 'app-fire-rocket',
  templateUrl: './fire-rocket.component.html',
  styleUrls: ['./fire-rocket.component.scss'],
})
export class FireRocketComponent implements OnInit, OnDestroy {
  armyDescriptionBefore: ArmyDescription = {
    droids: '?',
    tanks: '?',
    cannons: '?',
  };
  armyDescriptionAfter: ArmyDescription = {
    droids: '?',
    tanks: '?',
    cannons: '?',
  };
  targetLocation: BoardLocation = { row: 0, col: 0 };
  isTargetingRocketLauncher = false;
  rocketStrikeCost: RocketStrikeCostDescription = { current: 0, next: 0 };
  rocketDestructionAvailability: ExplainedAvailability = getNotAvailable('');
  rocketAvailability: ExplainedAvailability = getNotAvailable('');

  @Input() modal: any;

  private sub1: Subscription;
  private sub2: Subscription;
  private sub3: Subscription;
  private sub4: Subscription;

  constructor(
    private rocketAvailabilityService: RocketAvailabilityService,
    private currentActionsService: CurrentActionsService,
    private fieldSelectionService: DoubleFieldSelectionService,
    private rocketStrikeCostService: RocketStrikeCostService,
    private canDestroyRocketService: CanDestroyRocketService,
  ) {}

  ngOnInit(): void {
    this.sub1 = this.rocketAvailabilityService
      .getStateUpdates()
      .subscribe((availability) => {
        this.rocketAvailability = availability;
      });
    this.sub2 = this.fieldSelectionService
      .getStateUpdates()
      .subscribe((fieldSelection) => {
        const location = {
          row: fieldSelection.to.row,
          col: fieldSelection.to.col,
        };
        this.targetLocation = location;
      });
    this.sub3 = this.rocketStrikeCostService
      .getStateUpdates()
      .subscribe((cost) => {
        this.rocketStrikeCost = cost;
      });
    this.sub4 = this.canDestroyRocketService
      .getStateUpdates()
      .subscribe((canDestroyRocket) => {
        this.rocketDestructionAvailability = canDestroyRocket;
      });
    this.rocketAvailabilityService.requestState();
    this.fieldSelectionService.requestState();
    this.rocketStrikeCostService.requestState();
    this.canDestroyRocketService.requestState();
  }

  fireRocket(): void {
    const action = new FireRocketAction(
      this.targetLocation,
      this.isTargetingRocketLauncher,
      this.rocketStrikeCost.current
    );
    this.currentActionsService.pushAction(action);
    this.modal.close('');
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
    this.sub4.unsubscribe();
  }
}
