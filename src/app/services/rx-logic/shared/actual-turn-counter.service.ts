import { Injectable } from '@angular/core';
import { GameContext } from 'src/app/models/game-utility-models';
import { GameStateService } from '../../http/game-state.service';
import { ResourceProcessor } from '../templates/resource-processor';
import { GameContextService } from './game-context.service';

// Considered for simulations for first player turn + 1 on pre-moves
@Injectable({
  providedIn: 'root',
})
export class ActualTurnCounterService extends ResourceProcessor<number> {
  constructor(private contextService: GameContextService) {
    super([contextService]);
  }

  protected processData(dataElements: any[]): number {
    const [context] = dataElements as [GameContext];

    const playerId = context.player.id;
    const currentPlayerId = context.game.stateManager.currentPlayerId;
    const firstPlayerId = context.game.stateManager.firstPlayerId;

    const contextTurnCounter = context.game.stateManager.turnCounter;

    if (!currentPlayerId) {
      return contextTurnCounter;
    }

    const isPremoving = playerId === firstPlayerId && playerId !== currentPlayerId;
    return isPremoving ? contextTurnCounter + 1 : contextTurnCounter;
  }
}
