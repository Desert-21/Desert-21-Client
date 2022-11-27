import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationHandler } from 'src/app/models/notification-models';
import { GameInvitationNotification } from './game-invitation-received-handler.service';

@Injectable({
  providedIn: 'root',
})
export class GameInvitationAcceptedHandlerService
  implements NotificationHandler<GameInvitationNotification>
{
  constructor(private http: HttpClient) {}

  type = 'GAME_INVITATION_ACCEPTED';

  handle(notification: GameInvitationNotification): void {
    this.http
      .post(`/game-invitations/confirm/${notification.invitationId}`, null)
      .subscribe(() => {});
  }
}
