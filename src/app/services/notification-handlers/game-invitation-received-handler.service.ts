import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationHandler } from 'src/app/models/notification-models';
import { PlayerInvitedService } from '../rx-logic/menu/player-invited.service';
import { AcceptModalActionService } from '../rx-logic/shared/accept-modal-action.service';
import { GameModalService } from '../rx-logic/shared/game-modal.service';

export type GameInvitationNotification = {
  invitationId: string;
  playersNickname: string;
};

@Injectable({
  providedIn: 'root',
})
export class GameInvitationReceivedHandlerService
  implements NotificationHandler<GameInvitationNotification>
{
  constructor(
    private gameModalService: GameModalService,
    private acceptActionService: AcceptModalActionService,
    private http: HttpClient,
    private invitationInfoService: PlayerInvitedService
  ) {}

  type = 'GAME_INVITATION_RECEIVED';

  handle(invitationInfo: GameInvitationNotification): void {
    this.acceptActionService.set({
      text: `Player ${invitationInfo.playersNickname} invites you to a game. Do you accept?`,
      onAccept: () => {
        this.http
          .post(`/game-invitations/accept/${invitationInfo.invitationId}`, null)
          .subscribe(() => {});
        this.invitationInfoService.set({
          opponentsNickname: invitationInfo.playersNickname,
          invitationId: invitationInfo.invitationId,
        });
        this.gameModalService.openModal('WAITING_FOR_GAME_READINESS');
      },
      onReject: () => {
        this.http
          .post(`/game-invitations/reject/${invitationInfo.invitationId}`, null)
          .subscribe(() => {
            // todo...
          });
      },
    });
    this.gameModalService.openModal('ACCEPT');
  }
}
