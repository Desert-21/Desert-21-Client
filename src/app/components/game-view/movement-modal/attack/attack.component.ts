import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { AttackAction } from 'src/app/models/actions';
import { Army, BoardLocation } from 'src/app/models/game-models';
import { FromFieldArmyService } from 'src/app/services/rx-logic/double-field-selection/army-movements/from-field-army.service';
import { ToFieldAttackersPowerCalculatorService } from 'src/app/services/rx-logic/double-field-selection/army-movements/to-field-attackers-power-calculator.service';
import { ToFieldDefendersPowerCalculatorService } from 'src/app/services/rx-logic/double-field-selection/army-movements/to-field-defenders-power-calculator.service';
import { ToFieldDefendersService } from 'src/app/services/rx-logic/double-field-selection/army-movements/to-field-defenders.service';
import { ToFieldFromCurrentFieldAttackersService } from 'src/app/services/rx-logic/double-field-selection/army-movements/to-field-from-current-field-attackers.service';
import { ToFieldPostBombardingDefendersService } from 'src/app/services/rx-logic/double-field-selection/army-movements/to-field-post-bombarding-defenders.service';
import { ToFieldTotalAttackersService } from 'src/app/services/rx-logic/double-field-selection/army-movements/to-field-total-attackers.service';
import { WinningChanceCalculatorService } from 'src/app/services/rx-logic/double-field-selection/army-movements/winning-chance-calculator.service';
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

  defendersPower = '0';
  attackersPower = 0;

  winningChance = 0;

  @Input() modal: any;

  constructor(
    private fromFieldArmyService: FromFieldArmyService,
    private toFieldAttackersService: ToFieldTotalAttackersService,
    private toFieldPostBombardingDefendersService: ToFieldPostBombardingDefendersService,
    private toFieldFromCurrentAttackersService: ToFieldFromCurrentFieldAttackersService,
    private fieldSelectionService: DoubleFieldSelectionService,
    private currentActionsService: CurrentActionsService,
    private defendersPowerCalculatorService: ToFieldDefendersPowerCalculatorService,
    private attackersPowerCalculatorService: ToFieldAttackersPowerCalculatorService,
    private winningChanceCalculatorService: WinningChanceCalculatorService
  ) {}

  private selectedArmySubject = new Subject<Army>();

  private sub1: Subscription;
  private sub2: Subscription;
  private sub3: Subscription;
  private sub4: Subscription;
  private sub5: Subscription;
  private sub6: Subscription;
  private sub7: Subscription;

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
    this.sub3 = this.toFieldPostBombardingDefendersService
      .getStateUpdates()
      .subscribe((estimatedArmy) => {
        this.toFieldEnemyArmy = estimatedArmy.toStringDescription();
        this.isUnoccupied = estimatedArmy.ownership === 'UNOCCUPIED';
      });
    this.sub4 = this.fieldSelectionService
      .getStateUpdates()
      .subscribe((fieldSelection) => {
        this.currentPath = fieldSelection.path;
      });
    this.sub5 = this.defendersPowerCalculatorService
      .getStateUpdates()
      .subscribe(
        (defendersPower) =>
          (this.defendersPower = defendersPower.toStringDescription())
      );
    this.sub6 = this.attackersPowerCalculatorService
      .getStateUpdates()
      .subscribe((attackersPower) => {
        this.attackersPower = attackersPower;
      });
    this.sub7 = this.winningChanceCalculatorService
      .getStateUpdates()
      .subscribe((winningChance) => {
        this.winningChance = winningChance;
      });
    this.fromFieldArmyService.requestState();
    this.toFieldAttackersService.requestState();
    this.toFieldPostBombardingDefendersService.requestState();
    this.fieldSelectionService.requestState();
    this.defendersPowerCalculatorService.requestState();
    this.attackersPowerCalculatorService.requestState();
    this.winningChanceCalculatorService.requestState();
  }

  onArmySelectionChange(army: Army): void {
    this.currentArmySelection = army;
    this.toFieldFromCurrentAttackersService.set(army);
    this.isAttackDisabled =
      army.droids <= 0 && army.tanks <= 0 && army.cannons <= 0;
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
    this.sub5.unsubscribe();
    this.sub6.unsubscribe();
    this.sub7.unsubscribe();
    this.toFieldFromCurrentAttackersService.set({
      droids: 0,
      tanks: 0,
      cannons: 0,
    });
  }
}
