import { Injectable } from '@angular/core';
import { GameContext } from 'src/app/models/game-utility-models';
import { getScarabsRange, ScarabsRange } from 'src/app/utils/army-utils';
import { GameContextService } from './game-context.service';
import { ResourceProcessor } from '../templates/resource-processor';
import { ActualTurnCounterService } from './actual-turn-counter.service';

@Injectable({
  providedIn: 'root',
})
export class CurrentScarabsGenerationService extends ResourceProcessor<ScarabsRange> {
  constructor(private gameContextService: GameContextService, private turnCounterService: ActualTurnCounterService) {
    super([gameContextService, turnCounterService]);
  }

  protected processData(dataElements: any[]): ScarabsRange {
    const [context, turnCounter] = dataElements as [GameContext, number];
    return getScarabsRange(
      turnCounter,
      context.balance.combat.scarabs
    );
  }
}
