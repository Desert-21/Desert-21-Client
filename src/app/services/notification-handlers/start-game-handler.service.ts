import { Injectable } from '@angular/core';
import { Game } from 'src/app/models/game-models';
import { NotificationHandler, StartGameNotification } from 'src/app/models/notification-models';
import { GameStateService } from '../game-state.service';

@Injectable({
  providedIn: 'root'
})
export class StartGameHandlerService implements NotificationHandler<StartGameNotification> {

  constructor(private gameStateService: GameStateService) { }

  type: string = 'NEXT_TURN';

  handle(notification: StartGameNotification): void {
    const currentState = this.gameStateService.currentState();
    console.log(notification);
    const newGameState: Game = {
      ...currentState,
      stateManager: {
        ...currentState.stateManager,
        currentPlayerId: notification.currentPlayerId,
        timeout: notification.timeout,
        gameState: 'AWAITING',
      }
    }
    this.gameStateService.updateGameState(newGameState);
  }
}
