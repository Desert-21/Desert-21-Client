import { Injectable } from '@angular/core';
import { NotificationHandler } from 'src/app/models/notification-models';
import { UserInfoService } from '../http/user-info.service';
import { ToastsService } from '../rx-logic/shared/toasts.service';

@Injectable({
  providedIn: 'root',
})
export class RemovedFromFriendsHandlerService
  implements NotificationHandler<string>
{
  constructor(private toastsService: ToastsService, private userInfoService: UserInfoService) {}

  type = 'REMOVED_FROM_FRIEND_LIST';

  handle(nickname: string): void {
    this.toastsService.add({
      title: `${nickname} has removed you from their friend list!`,
      description: 'You can still add them again if you must...',
      theme: 'WARNING',
    });
    this.userInfoService.fetchState();
  }
}
