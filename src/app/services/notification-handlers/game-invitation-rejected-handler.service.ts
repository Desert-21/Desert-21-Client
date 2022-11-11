import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NotificationHandler } from 'src/app/models/notification-models';
import { GameInvitationNotification } from './game-invitation-received-handler.service';

@Injectable({
  providedIn: 'root',
})
export class GameInvitationRejectedHandlerService
  implements NotificationHandler<GameInvitationNotification>
{
  constructor() {}

  type = 'GAME_INVITATION_REJECTED';

  private subject = new Subject<GameInvitationNotification>();

  handle(notification: GameInvitationNotification): void {
    this.subject.next(notification);
  }

  getNotificationSignals(): Observable<GameInvitationNotification> {
    return this.subject.asObservable();
  }
}
