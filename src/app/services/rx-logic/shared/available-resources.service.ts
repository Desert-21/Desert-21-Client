import { Injectable } from '@angular/core';
import { ResourceSet } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import { GameContextService } from './game-context.service';
import { ResourceProcessor } from '../templates/resource-processor';

@Injectable({
  providedIn: 'root',
})
export class AvailableResourcesService extends ResourceProcessor<ResourceSet> {
  constructor(private gameContextService: GameContextService) {
    super([gameContextService]);
  }

  protected processData(dataElements: any[]): ResourceSet {
    const [context] = dataElements as [GameContext];
    const { player, currentActions } = context;
    const baseResourceSet = player.resources;
    const summedAllCosts = currentActions
      .map((a) => a.getCost())
      .reduce(
        (prev, next) => {
          return {
            metal: prev.metal + next.metal,
            buildingMaterials: prev.buildingMaterials + next.buildingMaterials,
            electricity: prev.electricity + next.electricity,
          };
        },
        { metal: 0, buildingMaterials: 0, electricity: 0 }
      );
    return {
      metal: baseResourceSet.metal - summedAllCosts.metal,
      buildingMaterials:
        baseResourceSet.buildingMaterials - summedAllCosts.buildingMaterials,
      electricity: baseResourceSet.electricity - summedAllCosts.electricity,
    };
  }
}
