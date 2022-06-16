import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MoveUnitsAction } from 'src/app/models/actions';
import { Army, BoardLocation } from 'src/app/models/game-models';
import { CurrentActionsService } from 'src/app/services/rx-logic/current-actions.service';
import { FromFieldArmyService } from 'src/app/services/rx-logic/from-field-army.service';
import { LastShortestPathCalculationService } from 'src/app/services/rx-logic/last-shortest-path-calculation.service';
import { ToFieldArmyService } from 'src/app/services/rx-logic/to-field-army.service';
import { sumArmies } from 'src/app/utils/army-utils';

@Component({
  selector: 'app-move-units',
  templateUrl: './move-units.component.html',
  styleUrls: ['./move-units.component.scss'],
})
export class MoveUnitsComponent implements OnInit, OnDestroy {
  maxArmy: Army = { droids: 0, tanks: 0, cannons: 0 };
  toFieldArmy: Army = { droids: 0, tanks: 0, cannons: 0 };

  toMove: Army = { droids: 0, tanks: 0, cannons: 0 };
  toFieldArmyAfterMovement: Army = this.toFieldArmy;

  path: Array<BoardLocation> = [];

  isConfirmEnabled = false;

  @Input() modal: any;

  private sub1: Subscription;
  private sub2: Subscription;
  private sub3: Subscription;

  constructor(
    private fromFieldArmyService: FromFieldArmyService,
    private toFieldArmyService: ToFieldArmyService,
    private currentActionsService: CurrentActionsService,
    private lastShortestPathService: LastShortestPathCalculationService
  ) {}

  ngOnInit(): void {
    this.sub1 = this.fromFieldArmyService.getStateUpdates().subscribe((maxArmy) => {
      this.maxArmy = maxArmy;
    });
    this.sub2 = this.toFieldArmyService.getStateUpdates().subscribe((targetArmy) => {
      this.toFieldArmy = targetArmy;
      this.toFieldArmyAfterMovement = targetArmy;
    });
    this.sub3 = this.lastShortestPathService.getStateUpdates().subscribe((path) => {
      this.path = path;
    });
    this.fromFieldArmyService.requestState();
    this.toFieldArmyService.requestState();
    this.lastShortestPathService.requestState();
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
  }

  onArmySelectionChange(army: Army): void {
    this.toMove = army;
    this.toFieldArmyAfterMovement = sumArmies(this.toFieldArmy, army);
    this.isConfirmEnabled =
      army.droids > 0 || army.tanks > 0 || army.cannons > 0;
  }

  onConfirm(): void {
    const action = new MoveUnitsAction(this.path, this.toMove);
    this.currentActionsService.pushAction(action);
    this.modal.close('');
  }
}
