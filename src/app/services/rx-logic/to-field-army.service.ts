import { Injectable } from '@angular/core';
import { Army, BoardLocation } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import { findByFieldLocation } from 'src/app/utils/location-utils';
import { GameContextService } from './game-context.service';
import { LastShortestPathCalculationService } from './last-shortest-path-calculation.service';
import { ResourceProcessor } from './resource-processor';

@Injectable({
  providedIn: 'root'
})
export class ToFieldArmyService extends ResourceProcessor<Army> {

  constructor(
    private lastShortestPathService: LastShortestPathCalculationService,
    private gameContextService: GameContextService
  ) {
    super([lastShortestPathService, gameContextService]);
  }

  protected processData(dataElements: any[]): Army {
    const [path, context] = dataElements as [Array<BoardLocation>, GameContext];
    if (path === null || path.length < 2) {
      return { droids: 0, tanks: 0, cannons: 0 };
    }
    const firstLoc = path[path.length - 1];
    const field = findByFieldLocation(
      firstLoc.row,
      firstLoc.col,
      context.game.fields
    );
    const army = field.army !== null ? field.army : {droids: 0, tanks: 0, cannons: 0} ;
    // todo: logic for other movements
    return army;
  }
}
