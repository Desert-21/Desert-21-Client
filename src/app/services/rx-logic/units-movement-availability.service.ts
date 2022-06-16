import { Injectable } from '@angular/core';
import { BoardLocation } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import { unitTypeToConfig } from 'src/app/utils/balance-utils';
import { GameContextService } from './game-context.service';
import { LastShortestPathCalculationService } from './last-shortest-path-calculation.service';
import { ResourceProcessor } from './resource-processor';

@Injectable({
  providedIn: 'root',
})
export class UnitsMovementAvailabilityService extends ResourceProcessor<
  [boolean, boolean, boolean]
> {
  constructor(
    private lastShortestPathService: LastShortestPathCalculationService,
    private gameContextService: GameContextService
  ) {
    super([lastShortestPathService, gameContextService]);
  }

  protected processData(dataElements: any[]): [boolean, boolean, boolean] {
    const [path, context] = dataElements as [Array<BoardLocation>, GameContext];
    if (path === null || path.length < 2) {
      return [false, false, false];
    }
    const realPathLength = path.length - 1;
    const combatConfig = context.balance.combat;

    const canMoveDroids =
      unitTypeToConfig(combatConfig, 'DROID').fieldsTraveledPerTurn >=
      realPathLength;
    const canMoveTanks =
      unitTypeToConfig(combatConfig, 'TANK').fieldsTraveledPerTurn >=
      realPathLength;
    const canMoveCannons =
      unitTypeToConfig(combatConfig, 'CANNON').fieldsTraveledPerTurn >=
      realPathLength;

    return [canMoveDroids, canMoveTanks, canMoveCannons];
  }
}
