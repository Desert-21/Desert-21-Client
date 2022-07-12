import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FireRocketAction } from 'src/app/models/actions';
import { BoardLocation } from 'src/app/models/game-models';
import { CanDestroyRocketService } from 'src/app/services/rx-logic/double-field-selection/can-destroy-rocket.service';
import { DoubleFieldSelectionService } from 'src/app/services/rx-logic/double-field-selection/double-field-selection.service';
import { DragAndDropFieldsSelectionService } from 'src/app/services/rx-logic/double-field-selection/drag-and-drop/drag-and-drop-fields-selection.service';
import { RocketAlreadyFiredService } from 'src/app/services/rx-logic/double-field-selection/rocket-already-fired.service';
import {
  RocketStrikeCostDescription,
  RocketStrikeCostService,
} from 'src/app/services/rx-logic/double-field-selection/rocket-strike-cost.service';
import { CurrentActionsService } from 'src/app/services/rx-logic/shared/current-actions.service';
import { ArmyDescription } from '../../right-panel/army-preview/army-preview-state';

@Component({
  selector: 'app-fire-rocket',
  templateUrl: './fire-rocket.component.html',
  styleUrls: ['./fire-rocket.component.scss'],
})
export class FireRocketComponent implements OnInit, OnDestroy {
  isAlreadyFired = false;
  armyDescription: ArmyDescription = {
    droids: '?',
    tanks: '?',
    cannons: '?',
  };
  targetLocation: BoardLocation = { row: 0, col: 0 };
  isTargetingRocketLauncher = false;
  rocketStrikeCost: RocketStrikeCostDescription = { current: 0, next: 0 };
  canDestroyRocket = false;

  @Input() modal: any;

  private sub1: Subscription;
  private sub2: Subscription;
  private sub3: Subscription;
  private sub4: Subscription;

  constructor(
    private rocketAlreadyFiredService: RocketAlreadyFiredService,
    private currentActionsService: CurrentActionsService,
    private fieldSelectionService: DoubleFieldSelectionService,
    private rocketStrikeCostService: RocketStrikeCostService,
    private canDestroyRocketSerivce: CanDestroyRocketService
  ) {}

  ngOnInit(): void {
    this.sub1 = this.rocketAlreadyFiredService
      .getStateUpdates()
      .subscribe((isAlreadyFired) => {
        this.isAlreadyFired = isAlreadyFired;
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
    this.sub4 = this.canDestroyRocketSerivce
      .getStateUpdates()
      .subscribe((canDestroyRocket) => {
        this.canDestroyRocket = canDestroyRocket;
      });
    this.rocketAlreadyFiredService.requestState();
    this.fieldSelectionService.requestState();
    this.rocketStrikeCostService.requestState();
    this.canDestroyRocketSerivce.requestState();
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
