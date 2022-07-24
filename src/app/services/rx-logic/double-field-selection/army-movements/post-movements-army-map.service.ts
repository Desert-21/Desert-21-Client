import { Injectable } from '@angular/core';
import {
  AttackAction,
  BombardAction,
  MoveUnitsAction,
} from 'src/app/models/actions';
import { Army, BoardLocation } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import { GameContextService } from '../../shared/game-context.service';
import { ResourceProcessor } from '../../templates/resource-processor';

type UnitsFreezingAction = MoveUnitsAction | AttackAction | BombardAction;

type UnitsFreeze = { army: Army; location: BoardLocation };

@Injectable({
  providedIn: 'root',
})
export class PostMovementsArmyMapService extends ResourceProcessor<Army[][]> {
  constructor(private contextService: GameContextService) {
    super([contextService]);
  }

  protected processData(dataElements: any[]): Army[][] {
    const [context] = dataElements as [GameContext];
    const fields = context.game.fields;
    const armyMap = fields.map((row) => {
      return row.map((cell) => {
        return { ...cell.army };
      });
    });
    const actions = context.currentActions;
    actions
      .filter((a) => ['ATTACK', 'BOMBARD', 'MOVE_UNITS'].includes(a.getType()))
      .map((a) => a as UnitsFreezingAction)
      .map(this.actionToUnitsFreeze)
      .forEach((freeze) => {
        const {
          army,
          location: { row, col },
        } = freeze;
        const armyBefore = armyMap[row][col];
        const armyAfter = {
          droids: armyBefore.droids - army.droids,
          tanks: armyBefore.tanks - army.tanks,
          cannons: armyBefore.cannons - army.cannons,
        };
        armyMap[row][col] = armyAfter;
      });
    return armyMap;
  }

  private actionToUnitsFreeze(action: UnitsFreezingAction): UnitsFreeze {
    const location = action.from;
    let army: Army;
    switch (action.getType()) {
      case 'MOVE_UNITS':
        const moveAction = action as MoveUnitsAction;
        army = moveAction.army;
        break;
      case 'ATTACK':
        const attackAction = action as AttackAction;
        army = attackAction.army;
        break;
      case 'BOMBARD':
        const bombardAction = action as BombardAction;
        army = { droids: 0, tanks: 0, cannons: bombardAction.cannonsAmount };
        break;
    }
    return { location, army };
  }
}
