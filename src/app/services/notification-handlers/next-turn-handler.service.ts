import { Injectable } from '@angular/core';
import { Game } from 'src/app/models/game-models';
import { NotificationHandler, NextTurnNotification } from 'src/app/models/notification-models';
import { GameStateService } from '../game-state.service';

@Injectable({
  providedIn: 'root'
})
export class NextTurnHandlerService implements NotificationHandler<NextTurnNotification> {

  constructor(private gameStateService: GameStateService) { }

  type: string = 'NEXT_TURN';

  handle(notification: NextTurnNotification): void {
    const currentState = this.gameStateService.getCurrentState();
    const newGameState: Game = {
      ...currentState,
      stateManager: {
        ...currentState.stateManager,
        currentPlayerId: notification.currentPlayerId,
        timeout: notification.timeout,
        gameState: 'AWAITING',
      }
    }
    this.gameStateService.updateState(newGameState);
  }
}
