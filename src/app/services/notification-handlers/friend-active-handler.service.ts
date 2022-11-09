import { Injectable } from '@angular/core';
import { NotificationHandler } from 'src/app/models/notification-models';
import { FriendsActivityService } from '../rx-logic/menu/friends-activity.service';

@Injectable({
  providedIn: 'root',
})
export class FriendActiveHandlerService implements NotificationHandler<string> {
  constructor(private friendsActivityService: FriendsActivityService) {}

  type = 'PLAYER_ACTIVE';

  handle(friendsId: string): void {
    this.friendsActivityService.put(friendsId, 'ACTIVE');
  }
}
