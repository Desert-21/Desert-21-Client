import { Injectable } from '@angular/core';
import {
  GameEndNotification,
  NotificationHandler,
} from 'src/app/models/notification-models';
import { UserInfoService } from '../http/user-info.service';
import { GameModalService } from '../rx-logic/shared/game-modal.service';
import { GameResultService } from '../rx-logic/shared/game-result.service';

@Injectable({
  providedIn: 'root',
})
export class GameEndNotificationHandlerService
  implements NotificationHandler<GameEndNotification>
{
  playersId = '';
  constructor(
    private gameModalService: GameModalService,
    private gameResultService: GameResultService,
    private playerIdService: UserInfoService
  ) {
    this.playerIdService.getStateUpdates().subscribe((resp) => {
      this.playersId = resp.id;
    });
    this.playerIdService.requestState();
  }

  type = 'GAME_END';

  handle(arg: GameEndNotification): void {
    const hasWon = arg.winnerId === this.playersId;
    const state = hasWon ? 'WIN' : 'LOOSE';
    this.gameResultService.set({
      state,
      bySurrender: false,
    });
    this.gameModalService.openModal('GAME_END');
  }
}
