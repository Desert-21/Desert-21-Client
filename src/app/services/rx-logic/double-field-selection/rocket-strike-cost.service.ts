import { Injectable } from '@angular/core';
import { GameContext } from 'src/app/models/game-utility-models';
import { getRocketStrikeCost } from 'src/app/models/rocket-strikes';
import { flattenFields } from 'src/app/utils/location-utils';
import { GameContextService } from '../shared/game-context.service';
import { ResourceProcessor } from '../templates/resource-processor';

export type RocketStrikeCostDescription = {
  current: number;
  next: number;
};

@Injectable({
  providedIn: 'root',
})
export class RocketStrikeCostService extends ResourceProcessor<RocketStrikeCostDescription> {
  constructor(private gameContextService: GameContextService) {
    super([gameContextService]);
  }

  protected processData(dataElements: any[]): RocketStrikeCostDescription {
    const [context] = dataElements as [GameContext];
    const balance = context.balance;
    const rocketStrikesDone = context.player.rocketStrikesDone;
    const fieldsOwned = flattenFields(context.game.fields).filter(
      (f) => f.ownerId === context.player.id
    );
    const current = getRocketStrikeCost(
      balance,
      rocketStrikesDone,
      fieldsOwned
    );
    const costDiff = context.balance.general.rocketStrikePricePerUsage;
    const next = current + costDiff;

    const isRocketFree = context.player.isNextRocketFree;
    if (isRocketFree) {
      return {
        current: 0,
        next: current,
      };
    }
    return {
      current,
      next,
    };
  }
}
