import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserInfoService } from 'src/app/services/http/user-info.service';
import { PlayerInvitedService } from 'src/app/services/rx-logic/menu/player-invited.service';
import {
  ProcessedFriendEntry,
  ProcessedFriendsService,
} from 'src/app/services/rx-logic/menu/processed-friends.service';
import { ConfirmModalActionService } from 'src/app/services/rx-logic/shared/confirm-modal-action.service';
import { GameModalService } from 'src/app/services/rx-logic/shared/game-modal.service';
import { ToastsService } from 'src/app/services/rx-logic/shared/toasts.service';
import { underscoreToRegular } from 'src/app/utils/text-utils';

export type InvitationIdJson = { invitationId: string };

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.scss'],
})
export class FriendsListComponent implements OnInit, OnDestroy {
  friends: Array<ProcessedFriendEntry> = [];
  isInitialLoad = true;

  timeout: any;

  constructor(
    private friendsService: ProcessedFriendsService,
    private http: HttpClient,
    private confirmModalService: ConfirmModalActionService,
    private gameModalService: GameModalService,
    private toastService: ToastsService,
    private userInfoService: UserInfoService,
    private playerInvitedService: PlayerInvitedService
  ) {}

  ngOnInit(): void {
    this.friendsService.getStateUpdates().subscribe((friends) => {
      this.friends = friends;
      if (this.isInitialLoad) {
        this.isInitialLoad = false;
        const that = this;
        setTimeout(() => {
          that.poll();
        }, 10_000);
        this.poll();
        this.initializeFriendsPolling();
      }
    });
    this.friendsService.requestState();
  }

  private initializeFriendsPolling(): void {
    this.timeout = setInterval(() => {
      this.poll();
    }, 240_000);
  }

  private poll(): void {
    this.http
      .post(
        '/users/ping/all',
        this.friends.map((f) => f.playerId)
      )
      .subscribe(() => {});
  }

  ngOnDestroy(): void {
    clearInterval(this.timeout);
  }

  onRemoveClick(friend: ProcessedFriendEntry): void {
    this.confirmModalService.set({
      text: `Are you sure you want to remove ${friend.nickname} from your friend list?`,
      action: () => {
        this.http
          .post(`/friends/remove/${friend.playerId}`, null)
          .subscribe(() => {
            this.toastService.add({
              title: 'Friend removed!',
              description: 'You can add them again if you need to.',
              theme: 'WARNING',
            });
            this.userInfoService.fetchState();
          });
      },
    });
    this.gameModalService.openModal('CONFIRM');
  }

  getLightDescription(friend: ProcessedFriendEntry): string {
    return underscoreToRegular(friend.status);
  }

  onInvitePlayerClick(player: ProcessedFriendEntry): void {
    this.http
      .post<InvitationIdJson>(
        `/gameInvitations/invite/${player.playerId}`,
        null
      )
      .subscribe(({ invitationId }) => {
        this.playerInvitedService.set({
          opponentsNickname: player.nickname,
          invitationId,
        });
        this.gameModalService.openModal('PLAYER_INVITED');
      });
  }
}
