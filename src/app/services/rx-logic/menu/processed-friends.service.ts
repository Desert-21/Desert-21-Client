import { Injectable } from '@angular/core';
import { FriendEntry, UsersData } from 'src/app/models/profile-models.';
import { UserInfoService } from '../../http/user-info.service';
import { ResourceProcessor } from '../templates/resource-processor';
import {
  FriendsActivityService,
  FriendsStatus,
} from './friends-activity.service';
import { FriendsListService } from './friends-list.service';

export type ProcessedFriendEntry = FriendEntry & {
  status: FriendsStatus;
};

@Injectable({
  providedIn: 'root',
})
export class ProcessedFriendsService extends ResourceProcessor<Array<ProcessedFriendEntry>> {
  constructor(
    private friendsListService: FriendsListService,
    private friendsActivityService: FriendsActivityService
  ) {
    super([friendsListService, friendsActivityService]);
  }

  protected processData(dataElements: any[]): Array<ProcessedFriendEntry> {
    const [friendList, friendsActivity] = dataElements as [Array<FriendEntry>, Map<string, FriendsStatus>];
    return friendList.map(f => ({
      ...f,
      status: friendsActivity.get(f.playerId) || 'INACTIVE'
    }));
  }
}
