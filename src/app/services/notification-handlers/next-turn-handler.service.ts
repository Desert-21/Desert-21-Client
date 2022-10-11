import { Injectable } from '@angular/core';
import { Game } from 'src/app/models/game-models';
import { NotificationHandler, NextTurnNotification } from 'src/app/models/notification-models';
import { GameStateService } from '../http/game-state.service';

@Injectable({
  providedIn: 'root'
})
export class NextTurnHandlerService implements NotificationHandler<NextTurnNotification> {

  constructor(private gameStateService: GameStateService) { }

  type = 'NEXT_TURN';

  handle(notification: NextTurnNotification): void {
    const currentState = this.gameStateService.getCurrentState();
    const newGameState: Game = {
      ...currentState,
      stateManager: {
        ...currentState.stateManager,
        currentPlayerId: notification.currentPlayerId,
        timeout: notification.timeout,
        gameState: 'AWAITING',
        turnCounter: notification.turnCounter,
      }
    };
    console.log('Received next turn notification with timeout: ', notification.timeout);
    this.gameStateService.updateState(newGameState);
  }
}
