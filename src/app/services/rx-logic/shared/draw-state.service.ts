import { Injectable } from '@angular/core';
import { ModifiableResource } from '../templates/modifiable-resource';
import { ResourceProcessor } from '../templates/resource-processor';
import { GameResult, GameResultService } from './game-result.service';
import { IsDrawRequestedService } from './is-draw-requested.service';

export type DrawState = 'NONE' | 'REQUESTED' | 'IMPOSSIBLE';

@Injectable({
  providedIn: 'root',
})
export class DrawStateService extends ResourceProcessor<DrawState> {
  constructor(
    private isDrawRequestedService: IsDrawRequestedService,
    private gameResultService: GameResultService
  ) {
    super([isDrawRequestedService, gameResultService]);
  }

  protected processData(dataElements: any[]): DrawState {
    const [isDrawRequested, {state}] = dataElements as [boolean, GameResult];
    if (state !== 'NEUTRAL') {
      return 'IMPOSSIBLE';
    }
    return isDrawRequested ? 'REQUESTED' : 'NONE';
  }
}
