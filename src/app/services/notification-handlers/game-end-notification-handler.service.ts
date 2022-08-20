import { Injectable } from '@angular/core';
import {
  GameEndNotification,
  NotificationHandler,
} from 'src/app/models/notification-models';
import { UserInfoService } from '../http/user-info.service';
import { GameModalService } from '../rx-logic/shared/game-modal.service';
import { HasPLayerWonService as HasPlayerWonService } from '../rx-logic/shared/has-player-won.service';
import { HasWonBySurrenderService } from '../rx-logic/shared/has-won-by-surrender.service';

@Injectable({
  providedIn: 'root',
})
export class GameEndNotificationHandlerService
  implements NotificationHandler<GameEndNotification>
{
  playersId = '';
  constructor(
    private gameModalService: GameModalService,
    private gameWinnerService: HasPlayerWonService,
    private playerIdService: UserInfoService,
    private hasWonBySurrenderService: HasWonBySurrenderService
  ) {
    this.playerIdService.getStateUpdates().subscribe((resp) => {
      this.playersId = resp.id;
    });
    this.playerIdService.requestState();
  }

  type = 'GAME_END';

  handle(arg: GameEndNotification): void {
    const hasWon = arg.winnerId === this.playersId;
    this.gameWinnerService.set(hasWon);
    this.hasWonBySurrenderService.set(false);
    this.gameModalService.openModal('GAME_END');
  }
}
