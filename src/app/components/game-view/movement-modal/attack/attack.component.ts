import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { AttackAction } from 'src/app/models/actions';
import { Army, BoardLocation } from 'src/app/models/game-models';
import { FromFieldArmyService } from 'src/app/services/rx-logic/double-field-selection/army-movements/from-field-army.service';
import { ToFieldDefendersService } from 'src/app/services/rx-logic/double-field-selection/army-movements/to-field-defenders.service';
import { ToFieldFromCurrentFieldAttackersService } from 'src/app/services/rx-logic/double-field-selection/army-movements/to-field-from-current-field-attackers.service';
import { ToFieldTotalAttackersService } from 'src/app/services/rx-logic/double-field-selection/army-movements/to-field-total-attackers.service';
import { DoubleFieldSelectionService } from 'src/app/services/rx-logic/double-field-selection/double-field-selection.service';
import { CurrentActionsService } from 'src/app/services/rx-logic/shared/current-actions.service';
import { ArmyDescription } from '../../right-panel/army-preview/army-preview-state';

@Component({
  selector: 'app-attack',
  templateUrl: './attack.component.html',
  styleUrls: ['./attack.component.scss'],
})
export class AttackComponent implements OnInit, OnDestroy {
  isAttackDisabled = true;
  isUnoccupied = true;

  currentArmySelection: Army = { droids: 0, tanks: 0, cannons: 0 };
  maxArmy: Army = { droids: 0, tanks: 0, cannons: 0 };

  attackersFromOtherFields: Army = { droids: 0, tanks: 0, cannons: 0 };
  toFieldArmyAfterMovement: Army = { droids: 0, tanks: 0, cannons: 0 };

  toFieldEnemyArmy: ArmyDescription = { droids: '0', tanks: '0', cannons: '0' };

  currentPath: Array<BoardLocation> = [];

  @Input() modal: any;

  constructor(
    private fromFieldArmyService: FromFieldArmyService,
    private toFieldAttackersService: ToFieldTotalAttackersService,
    private toFieldDefendersService: ToFieldDefendersService,
    private toFieldFromCurrentAttackersService: ToFieldFromCurrentFieldAttackersService,
    private fieldSelectionService: DoubleFieldSelectionService,
    private currentActionsService: CurrentActionsService
  ) {}

  private selectedArmySubject = new Subject<Army>();

  private sub1: Subscription;
  private sub2: Subscription;
  private sub3: Subscription;
  private sub4: Subscription;

  ngOnInit(): void {
    this.sub1 = this.fromFieldArmyService
      .getStateUpdates()
      .subscribe((army) => {
        this.maxArmy = army;
      });
    this.sub2 = this.toFieldAttackersService
      .getStateUpdates()
      .subscribe((army) => {
        this.toFieldArmyAfterMovement = army;
      });
    this.sub3 = this.toFieldDefendersService
      .getStateUpdates()
      .subscribe((estimatedArmy) => {
        this.toFieldEnemyArmy = estimatedArmy.toStringDescription();
        this.isUnoccupied = !estimatedArmy.isEnemy;
      });
    this.sub4 = this.fieldSelectionService
      .getStateUpdates()
      .subscribe((fieldSelection) => {
        this.currentPath = fieldSelection.path;
      });
    this.fromFieldArmyService.requestState();
    this.toFieldAttackersService.requestState();
    this.toFieldDefendersService.requestState();
    this.fieldSelectionService.requestState();
  }

  onArmySelectionChange(army: Army): void {
    this.currentArmySelection = army;
    this.toFieldFromCurrentAttackersService.set(army);
    this.isAttackDisabled = army.droids <= 0 && army.tanks <= 0 && army.cannons <= 0;
  }

  getSelectedArmyObservable(): Observable<Army> {
    return this.selectedArmySubject.asObservable();
  }

  onAttackClick(): void {
    const attackAction: AttackAction = new AttackAction(
      this.currentPath,
      this.currentArmySelection
    );
    this.currentActionsService.pushAction(attackAction);
    this.modal.close('');
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
    this.sub4.unsubscribe();
  }
}
