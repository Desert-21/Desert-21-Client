import { Injectable } from '@angular/core';
import { ResourceSet } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import {
  addResources,
  calculateResourceProduction,
} from 'src/app/utils/resource-utils';
import { ResourceProcessor } from '../templates/resource-processor';
import { AvailableResourcesService } from './available-resources.service';
import { GameContextService } from './game-context.service';

@Injectable({
  providedIn: 'root',
})
export class NextTurnResourcesService extends ResourceProcessor<ResourceSet> {
  constructor(
    private gameContextService: GameContextService,
    private availableResourcesService: AvailableResourcesService
  ) {
    super([gameContextService, availableResourcesService]);
  }

  protected processData(dataElements: any[]): ResourceSet {
    const [context, availableResources] = dataElements as [
      GameContext,
      ResourceSet
    ];
    const { game, player, balance } = context;
    const production = calculateResourceProduction(game, player, balance);
    return addResources(availableResources, production);
  }
}
