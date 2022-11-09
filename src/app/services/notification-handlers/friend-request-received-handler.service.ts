import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationHandler } from 'src/app/models/notification-models';
import { UserInfoService } from '../http/user-info.service';
import { AcceptModalActionService } from '../rx-logic/shared/accept-modal-action.service';
import { GameModalService } from '../rx-logic/shared/game-modal.service';
import { ToastsService } from '../rx-logic/shared/toasts.service';

type FriendRequestNotification = {
  id: string;
  nickname: string;
};

@Injectable({
  providedIn: 'root',
})
export class FriendRequestReceivedHandlerService
  implements NotificationHandler<FriendRequestNotification>
{
  constructor(
    private acceptModalService: AcceptModalActionService,
    private http: HttpClient,
    private toastsService: ToastsService,
    private gameModalService: GameModalService
  ) {}

  type = 'FRIENDS_INVITATION_RECEIVED';

  handle(notification: FriendRequestNotification): void {
    this.acceptModalService.set({
      text: `Player ${notification.nickname} is inviting you to friends. Will you accept?`,
      onAccept: () => {
        this.http
          .post(`/friends/accept/${notification.id}`, null)
          .subscribe((resp) => {
            this.toastsService.add({
              title: 'Invitation accepted!',
              description:
                "You can now invite yourselves to games... and that's mostly it!",
              theme: 'SUCCESS',
            });
          });
      },
      onReject: () => {
        this.http.post(`/friends/reject/${notification.id}`, null);
      },
    });
    this.gameModalService.openModal('ACCEPT');
  }
}
