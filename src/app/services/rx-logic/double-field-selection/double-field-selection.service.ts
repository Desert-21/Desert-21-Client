import { Injectable } from '@angular/core';
import { BoardLocation } from 'src/app/models/game-models';
import { FieldSelection, GameContext } from 'src/app/models/game-utility-models';
import { findByFieldLocation } from 'src/app/utils/location-utils';
import { GameContextService } from '../shared/game-context.service';
import { LastShortestPathCalculationService } from './drag-and-drop/last-shortest-path-calculation.service';
import { ResourceProcessor } from '../templates/resource-processor';

export type DoubleFieldSelection = {
  from: FieldSelection;
  to: FieldSelection;
  path: Array<BoardLocation>;
};

@Injectable({
  providedIn: 'root'
})
export class DoubleFieldSelectionService extends ResourceProcessor<DoubleFieldSelection | null> {

  constructor(private lastShortestPathService: LastShortestPathCalculationService, private gameContextService: GameContextService) {
    super([lastShortestPathService, gameContextService]);
  }

  protected processData(dataElements: any[]): DoubleFieldSelection | null {
    const [path, context] = dataElements as [Array<BoardLocation>, GameContext];
    if (path === null || context === null || path.length < 2) {
      return null;
    }
    const fromLoc = path[0];
    const toLoc = path[path.length - 1];
    const fromField = findByFieldLocation(fromLoc, context.game.fields);
    const toField = findByFieldLocation(toLoc, context.game.fields);
    const fromIsOwned = fromField.ownerId === context.player.id;
    const toIsOwned = toField.ownerId === context.player.id;
    const fromIsEnemy = fromField.ownerId === context.opponent.id;
    const toIsEnemy = toField.ownerId === context.opponent.id;
    return {
      from: {
        row: fromLoc.row,
        col: fromLoc.col,
        field: fromField,
        isOwned: fromIsOwned,
        isEnemy: fromIsEnemy
      },
      to: {
        row: toLoc.row,
        col: toLoc.col,
        field: toField,
        isOwned: toIsOwned,
        isEnemy: toIsEnemy,
      },
      path,
    };
  }
}
