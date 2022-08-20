import { Injectable } from '@angular/core';
import { Player } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import {
  NotificationHandler,
  SurrenderNotification,
} from 'src/app/models/notification-models';
import { UserInfoService } from '../http/user-info.service';
import { GameContextService } from '../rx-logic/shared/game-context.service';
import { GameModalService } from '../rx-logic/shared/game-modal.service';
import { HasPLayerWonService } from '../rx-logic/shared/has-player-won.service';
import { HasWonBySurrenderService } from '../rx-logic/shared/has-won-by-surrender.service';

@Injectable({
  providedIn: 'root',
})
export class SurrenderHandlerService
  implements NotificationHandler<SurrenderNotification>
{
  playersId = '';

  constructor(
    private gameWinnerService: HasPLayerWonService,
    private userInfoService: UserInfoService,
    private gameModalService: GameModalService,
    private hasWonBySurrenderService: HasWonBySurrenderService
  ) {
    this.userInfoService.getStateUpdates()
    .subscribe((resp) => {
      this.playersId = resp.id;
    });
  }
  type = 'SURRENDER';

  handle(arg: SurrenderNotification): void {
    const hasWon = this.playersId !== arg.playerId;
    this.gameWinnerService.set(hasWon);
    this.hasWonBySurrenderService.set(true);
    this.gameModalService.openModal('GAME_END');
  }
}
