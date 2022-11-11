import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FriendEntry } from 'src/app/models/profile-models.';
import { UserInfoService } from 'src/app/services/http/user-info.service';
import { FriendsListUpdatedHandlerService } from 'src/app/services/notification-handlers/friends-list-updated-handler.service';
import { FriendsActivityService } from 'src/app/services/rx-logic/menu/friends-activity.service';
import { ProcessedFriendEntry, ProcessedFriendsService } from 'src/app/services/rx-logic/menu/processed-friends.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent implements OnInit, OnDestroy {
  friends: Array<FriendEntry> = [];

  constructor(
    private http: HttpClient,
    private friendsService: ProcessedFriendsService,
  ) {}

  private sub1: Subscription;

  ngOnInit(): void {
    this.sub1 = this.friendsService.getStateUpdates().subscribe((state) => {
      this.friends = state;
    });
    this.friendsService.requestState();
  }

  onRefreshClick(): void {
    this.http
      .post(
        '/users/ping/all',
        this.friends.map((f) => f.playerId)
      )
      .subscribe(() => {});
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
