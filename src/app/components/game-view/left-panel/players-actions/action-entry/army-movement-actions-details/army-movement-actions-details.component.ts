import { Component, Input, OnInit } from '@angular/core';
import { AttackAction, MoveUnitsAction } from 'src/app/models/actions';
import { Army } from 'src/app/models/game-models';

type ArmyMovementActions = MoveUnitsAction | AttackAction;

@Component({
  selector: 'app-army-movement-actions-details',
  templateUrl: './army-movement-actions-details.component.html',
  styleUrls: ['./army-movement-actions-details.component.scss'],
})
export class ArmyMovementActionsDetailsComponent implements OnInit {
  private _action: ArmyMovementActions = null;
  army: Army = { droids: 0, tanks: 0, cannons: 0 };

  constructor() {}

  ngOnInit(): void {}

  get action(): ArmyMovementActions {
    return this._action;
  }

  @Input()
  set action(action: ArmyMovementActions) {
    this.army = action.army;
    this._action = action;
  }
}
