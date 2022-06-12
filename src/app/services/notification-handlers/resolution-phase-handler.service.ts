import { Injectable } from '@angular/core';
import {
  NotificationHandler,
  ResolutionPhaseNotification,
} from 'src/app/models/notification-models';
import { GameStateService } from '../http/game-state.service';

@Injectable({
  providedIn: 'root',
})
export class ResolutionPhaseHandlerService
  implements NotificationHandler<ResolutionPhaseNotification>
{
  constructor(private gameStateService: GameStateService) {}

  type = 'RESOLUTION_PHASE';

  handle(arg: ResolutionPhaseNotification): void {
    this.gameStateService.fetchState(); // forcing state fetch
  }
}
