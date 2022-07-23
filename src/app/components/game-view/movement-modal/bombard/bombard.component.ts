import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BombardAction } from 'src/app/models/actions';
import { BoardLocation } from 'src/app/models/game-models';
import { FromFieldArmyService } from 'src/app/services/rx-logic/double-field-selection/army-movements/from-field-army.service';
import { DoubleFieldSelectionService } from 'src/app/services/rx-logic/double-field-selection/double-field-selection.service';
import { CurrentActionsService } from 'src/app/services/rx-logic/shared/current-actions.service';

@Component({
  selector: 'app-bombard',
  templateUrl: './bombard.component.html',
  styleUrls: ['./bombard.component.scss'],
})
export class BombardComponent implements OnInit, OnDestroy {
  path: Array<BoardLocation> = [];
  maxCannons = 0;
  selectedCannons = 0;

  @Input() modal: any;

  sub1: Subscription;
  sub2: Subscription;

  constructor(
    private availableArmyService: FromFieldArmyService,
    private currentActionsService: CurrentActionsService,
    private fieldSelectionService: DoubleFieldSelectionService
  ) {}

  ngOnInit(): void {
    this.sub1 = this.availableArmyService
      .getStateUpdates()
      .subscribe((army) => {
        this.maxCannons = army.cannons;
      });
    this.sub2 = this.fieldSelectionService
      .getStateUpdates()
      .subscribe((fieldSelection) => {
        this.path = fieldSelection.path;
      });
    this.availableArmyService.requestState();
    this.fieldSelectionService.requestState();
  }

  onBombardClick(): void {
    const action = new BombardAction(this.path, this.selectedCannons);
    this.currentActionsService.pushAction(action);
    this.modal.close('');
  }

  selectMax(): void {
    this.selectedCannons = this.maxCannons;
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }
}
