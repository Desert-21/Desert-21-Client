import { Injectable } from '@angular/core';
import {
  NotificationHandler,
  ResolutionPhaseNotification,
} from 'src/app/models/notification-models';
import { GameStateService } from '../http/game-state.service';
import { ResolutionPhaseDataService } from '../rx-logic/resolution-phase/resolution-phase-data.service';
import { GameModalService } from '../rx-logic/shared/game-modal.service';

@Injectable({
  providedIn: 'root',
})
export class ResolutionPhaseHandlerService
  implements NotificationHandler<ResolutionPhaseNotification>
{
  constructor(
    private gameStateService: GameStateService,
    private gameModalService: GameModalService,
    private resolutionPhaseDataService: ResolutionPhaseDataService
  ) {}

  type = 'RESOLUTION_PHASE';

  handle(arg: ResolutionPhaseNotification): void {
    this.gameStateService.fetchState(); // forcing state fetch
    this.gameModalService.openModal('RESOLUTION');
    this.resolutionPhaseDataService.set(arg);
  }
}
