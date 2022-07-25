import { Injectable } from '@angular/core';
import { ResourceSet } from 'src/app/models/game-models';
import { ExplainedAvailability, getAvailable, getNotAvailable } from 'src/app/utils/validation';
import { AvailableResourcesService } from '../shared/available-resources.service';
import { ResourceProcessor } from '../templates/resource-processor';
import { RocketAlreadyFiredService } from './rocket-already-fired.service';
import {
  RocketStrikeCostDescription,
  RocketStrikeCostService,
} from './rocket-strike-cost.service';

@Injectable({
  providedIn: 'root',
})
export class RocketAvailabilityService extends ResourceProcessor<ExplainedAvailability> {
  constructor(
    private rocketStrikeCostService: RocketStrikeCostService,
    private rocketAlreadyFiredService: RocketAlreadyFiredService,
    private availableResourcesService: AvailableResourcesService
  ) {
    super([
      rocketStrikeCostService,
      rocketAlreadyFiredService,
      availableResourcesService,
    ]);
  }

  protected processData(dataElements: any[]): ExplainedAvailability {
    const [cost, alreadyFired, availableResources] = dataElements as [
      RocketStrikeCostDescription,
      boolean,
      ResourceSet
    ];
    if (alreadyFired) {
      return getNotAvailable('Rocket has been already fired this turn.');
    }
    if (availableResources.electricity < cost.current) {
      return getNotAvailable('You don\'t have enough electricity.');
    }
    return getAvailable();
  }
}
