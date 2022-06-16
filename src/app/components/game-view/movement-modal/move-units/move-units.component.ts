import { Component, Input, OnInit } from '@angular/core';
import { MoveUnitsAction } from 'src/app/models/actions';
import { Army, BoardLocation } from 'src/app/models/game-models';
import { CurrentActionsService } from 'src/app/services/rx-logic/current-actions.service';
import { FromFieldArmyService } from 'src/app/services/rx-logic/from-field-army.service';
import { LastShortestPathCalculationService } from 'src/app/services/rx-logic/last-shortest-path-calculation.service';
import { ToFieldArmyService } from 'src/app/services/rx-logic/to-field-army.service';

@Component({
  selector: 'app-move-units',
  templateUrl: './move-units.component.html',
  styleUrls: ['./move-units.component.scss'],
})
export class MoveUnitsComponent implements OnInit {
  maxArmy: Army = { droids: 0, tanks: 0, cannons: 0 };
  toFieldArmy: Army = { droids: 0, tanks: 0, cannons: 0 };

  toMove: Army = { droids: 0, tanks: 0, cannons: 0 };
  toFieldArmyAfterMovement: Army = this.toFieldArmy;

  path: Array<BoardLocation> = [];

  constructor(
    private fromFieldArmyService: FromFieldArmyService,
    private toFieldArmyService: ToFieldArmyService,
    private currentActionsService: CurrentActionsService,
    private lastShortestPathService: LastShortestPathCalculationService
  ) {}

  ngOnInit(): void {
    this.fromFieldArmyService.getStateUpdates().subscribe((maxArmy) => {
      this.maxArmy = maxArmy;
    });
    this.toFieldArmyService.getStateUpdates().subscribe((targetArmy) => {
      this.toFieldArmy = targetArmy;
      this.toFieldArmyAfterMovement = targetArmy;
    });
    this.lastShortestPathService.getStateUpdates().subscribe((path) => {
      this.path = path;
    });
    this.fromFieldArmyService.requestState();
    this.toFieldArmyService.requestState();
    this.lastShortestPathService.requestState();
  }

  onArmySelectionChange(army: Army): void {
    this.toMove = army;
    this.toFieldArmyAfterMovement = {
      droids: this.toFieldArmy.droids + army.droids,
      tanks: this.toFieldArmy.tanks + army.tanks,
      cannons: this.toFieldArmy.cannons + army.cannons,
    };
  }

  onConfirm(): void {
    const action = new MoveUnitsAction(this.path, this.toMove);
    this.currentActionsService.pushAction(action);
  }
}
