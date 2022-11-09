import { Injectable } from '@angular/core';
import { map, merge, Observable } from 'rxjs';
import { FriendEntry } from 'src/app/models/profile-models.';
import { UserInfoService } from '../../http/user-info.service';
import { FriendsListUpdatedHandlerService } from '../../notification-handlers/friends-list-updated-handler.service';
import { RequestableResource } from '../templates/requestable-resource';

@Injectable({
  providedIn: 'root',
})
export class FriendsListService
  implements RequestableResource<Array<FriendEntry>>
{
  constructor(
    private userInfoService: UserInfoService,
    private friendListUpdatesService: FriendsListUpdatedHandlerService
  ) {}

  requestState(): void {
    this.friendListUpdatesService.requestState();
    this.userInfoService.requestState();
  }

  getStateUpdates(): Observable<FriendEntry[]> {
    return merge(
      this.userInfoService.getStateUpdates().pipe(map((u) => u.friends)),
      this.friendListUpdatesService.getStateUpdates()
    );
  }
}
