import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subject,
  Subscription,
} from 'rxjs';
import { BombardAction } from 'src/app/models/actions';
import { BoardLocation } from 'src/app/models/game-models';
import { FromFieldArmyService } from 'src/app/services/rx-logic/double-field-selection/army-movements/from-field-army.service';
import { ToFieldBombardingAttackersService } from 'src/app/services/rx-logic/double-field-selection/army-movements/to-field-bombarding-attackers.service';
import { ToFieldPostRocketsDefendersService } from 'src/app/services/rx-logic/double-field-selection/army-movements/to-field-post-rockets-defenders.service';
import { DoubleFieldSelectionService } from 'src/app/services/rx-logic/double-field-selection/double-field-selection.service';
import { CurrentActionsService } from 'src/app/services/rx-logic/shared/current-actions.service';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import { performBombardingOnEstimatedArmy } from 'src/app/utils/battles';
import { ArmyDescription } from '../../right-panel/army-preview/army-preview-state';

@Component({
  selector: 'app-bombard',
  templateUrl: './bombard.component.html',
  styleUrls: ['./bombard.component.scss'],
})
export class BombardComponent implements OnInit, OnDestroy {
  path: Array<BoardLocation> = [];
  maxCannons = 0;
  private _selectedCannons = 0;
  selectedCannonsSubject = new BehaviorSubject<number>(0);

  otherActionsAttackers = 0;

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

  @Input() modal: any;

  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  sub4: Subscription;

  constructor(
    private availableArmyService: FromFieldArmyService,
    private currentActionsService: CurrentActionsService,
    private fieldSelectionService: DoubleFieldSelectionService,
    private bombardingAttackersService: ToFieldBombardingAttackersService,
    private postRocketStrikeDefendersService: ToFieldPostRocketsDefendersService,
    private gameContextService: GameContextService
  ) {}

  ngOnInit(): void {
    this.sub1 = this.availableArmyService
      .getStateUpdates()
      .subscribe((army) => {
        this.maxCannons = army.cannons;
      });
    this.sub2 = combineLatest([
      this.bombardingAttackersService.getStateUpdates(),
      this.getSelectedCannonsObservable(),
      this.postRocketStrikeDefendersService.getStateUpdates(),
      this.gameContextService.getStateUpdates(),
      this.fieldSelectionService
      .getStateUpdates()
    ]).subscribe(([otherActionsAttackers, currentActionAttackers, estimatedDefenders, context, fieldSelection]) => {
      this.otherActionsAttackers = otherActionsAttackers;
      this.armyDescriptionBefore = estimatedDefenders.toStringDescription();
      this.path = fieldSelection.path;
      this.armyDescriptionAfter = performBombardingOnEstimatedArmy(
        otherActionsAttackers + currentActionAttackers,
        estimatedDefenders,
        context.balance,
        context.opponent,
        context.player,
        fieldSelection.to.field.building,
      ).toStringDescription();
    });
    this.availableArmyService.requestState();
    this.fieldSelectionService.requestState();
    this.bombardingAttackersService.requestState();
    this.postRocketStrikeDefendersService.requestState();
    this.gameContextService.requestState();
  }

  onBombardClick(): void {
    const action = new BombardAction(this.path, this.selectedCannons);
    this.currentActionsService.pushAction(action);
    this.modal.close('');
  }

  selectMax(): void {
    this.selectedCannons = this.maxCannons;
  }

  get selectedCannons(): number {
    return this._selectedCannons;
  }

  getSelectedCannonsObservable(): Observable<number> {
    return this.selectedCannonsSubject.asObservable();
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  set selectedCannons(selectedCannons: number) {
    this.selectedCannonsSubject.next(selectedCannons);
    this._selectedCannons = selectedCannons;
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    // this.sub3.unsubscribe();
    // this.sub4.unsubscribe();
  }
}
