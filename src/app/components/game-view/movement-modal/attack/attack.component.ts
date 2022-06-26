import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { Army } from 'src/app/models/game-models';
import { FromFieldArmyService } from 'src/app/services/rx-logic/double-field-selection/army-movements/from-field-army.service';
import { ToFieldFromOtherFieldsAttackersService } from 'src/app/services/rx-logic/double-field-selection/army-movements/to-field-from-other-fields-attackers.service';
import { ToFieldDefendersService } from 'src/app/services/rx-logic/double-field-selection/army-movements/to-field-defenders.service';
import { sumArmies } from 'src/app/utils/army-utils';
import { ArmyDescription } from '../../right-panel/army-preview/army-preview-state';
import { ToFieldFromCurrentFieldAttackersService } from 'src/app/services/rx-logic/double-field-selection/army-movements/to-field-from-current-field-attackers.service';
import { ToFieldTotalAttackersService } from 'src/app/services/rx-logic/double-field-selection/army-movements/to-field-total-attackers.service';

@Component({
  selector: 'app-attack',
  templateUrl: './attack.component.html',
  styleUrls: ['./attack.component.scss'],
})
export class AttackComponent implements OnInit, OnDestroy {
  isUnoccupied = true;

  maxArmy: Army = { droids: 0, tanks: 0, cannons: 0 };

  attackersFromOtherFields: Army = { droids: 0, tanks: 0, cannons: 0 };
  toFieldArmyAfterMovement: Army = { droids: 0, tanks: 0, cannons: 0 };

  toFieldEnemyArmy: ArmyDescription = { droids: '0', tanks: '0', cannons: '0' };

  constructor(
    private fromFieldArmyService: FromFieldArmyService,
    private toFieldAttackersService: ToFieldTotalAttackersService,
    private toFieldDefendersService: ToFieldDefendersService,
    private toFieldFromCurrentAttackersService: ToFieldFromCurrentFieldAttackersService
  ) {}

  private selectedArmySubject = new Subject<Army>();

  private sub1: Subscription;
  private sub2: Subscription;
  private sub3: Subscription;

  ngOnInit(): void {
    this.sub1 = this.fromFieldArmyService.getStateUpdates().subscribe((army) => {
      this.maxArmy = army;
    });
    this.sub2 = this.toFieldAttackersService.getStateUpdates().subscribe(army => {
      this.toFieldArmyAfterMovement = army;
    });
    this.sub3 = this.toFieldDefendersService.getStateUpdates().subscribe(estimatedArmy => {
      this.toFieldEnemyArmy = estimatedArmy.toStringDescription();
      this.isUnoccupied = !estimatedArmy.isEnemy;
    });
    this.fromFieldArmyService.requestState();
    this.toFieldDefendersService.requestState();
  }

  onArmySelectionChange(army: Army): void {
    this.toFieldFromCurrentAttackersService.set(army);
  }

  getSelectedArmyObservable(): Observable<Army> {
    return this.selectedArmySubject.asObservable();
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
  }
}
