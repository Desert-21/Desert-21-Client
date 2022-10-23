import { Injectable } from '@angular/core';
import {
  NotificationHandler,
  SurrenderNotification,
} from 'src/app/models/notification-models';
import { UserInfoService } from '../http/user-info.service';
import { GameModalService } from '../rx-logic/shared/game-modal.service';
import { GameResultService } from '../rx-logic/shared/game-result.service';

@Injectable({
  providedIn: 'root',
})
export class SurrenderHandlerService
  implements NotificationHandler<SurrenderNotification>
{
  playersId = '';

  constructor(
    private userInfoService: UserInfoService,
    private gameModalService: GameModalService,
    private gameResultService: GameResultService
  ) {
    this.userInfoService.getStateUpdates().subscribe((resp) => {
      this.playersId = resp.id;
    });
  }
  type = 'SURRENDER';

  handle(arg: SurrenderNotification): void {
    const hasWon = this.playersId !== arg.playerId;
    const state = hasWon ? 'WIN' : 'LOOSE';
    this.gameResultService.set({
      state,
      bySurrender: true,
    });
    this.gameModalService.openModal('GAME_END');
  }
}
