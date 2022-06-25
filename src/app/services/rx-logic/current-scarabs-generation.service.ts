import { Injectable } from '@angular/core';
import { GameContext } from 'src/app/models/game-utility-models';
import { getScarabsRange, ScarabsRange } from 'src/app/utils/army-utils';
import { GameContextService } from './game-context.service';
import { ResourceProcessor } from './resource-processor';

@Injectable({
  providedIn: 'root',
})
export class CurrentScarabsGenerationService extends ResourceProcessor<ScarabsRange> {
  constructor(private gameContextService: GameContextService) {
    super([gameContextService]);
  }

  protected processData(dataElements: any[]): ScarabsRange {
    const [context] = dataElements as [GameContext];
    return getScarabsRange(
      context.game.stateManager.turnCounter,
      context.balance.combat.scarabs
    );
  }
}
