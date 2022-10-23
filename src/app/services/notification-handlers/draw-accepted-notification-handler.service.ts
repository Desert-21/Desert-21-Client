import { Injectable } from '@angular/core';
import { NotificationHandler } from 'src/app/models/notification-models';
import { DrawStateService } from '../rx-logic/shared/draw-state.service';
import { GameModalService } from '../rx-logic/shared/game-modal.service';
import { GameResultService } from '../rx-logic/shared/game-result.service';

@Injectable({
  providedIn: 'root',
})
export class DrawAcceptedNotificationHandlerService
  implements NotificationHandler<string>
{
  constructor(
    private gameResultService: GameResultService,
    private gameModalService: GameModalService,
  ) {}

  type = 'DRAW_ACCEPTED';

  handle(arg: string): void {
    this.gameResultService.set({
      state: 'DRAW',
      bySurrender: false,
    });
    this.gameModalService.openModal('GAME_END');
  }
}
