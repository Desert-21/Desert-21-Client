import { Injectable } from '@angular/core';
import { BearerTokenService } from './bearer-token.service';
import { UserInfoService } from './http/user-info.service';
import { DrawAcceptedNotificationHandlerService } from './notification-handlers/draw-accepted-notification-handler.service';
import { DrawRejectedNotificationHandlerService } from './notification-handlers/draw-rejected-notification-handler.service';
import { DrawRequestedNotificationHandlerService } from './notification-handlers/draw-requested-notification-handler.service';
import { FriendActiveHandlerService } from './notification-handlers/friend-active-handler.service';
import { FriendRequestReceivedHandlerService } from './notification-handlers/friend-request-received-handler.service';
import { FriendsListUpdatedHandlerService } from './notification-handlers/friends-list-updated-handler.service';
import { GameEndNotificationHandlerService } from './notification-handlers/game-end-notification-handler.service';
import { GameInvitationAcceptedHandlerService } from './notification-handlers/game-invitation-accepted-handler.service';
import { GameInvitationCancelledHandlerService } from './notification-handlers/game-invitation-cancelled-handler.service';
import { GameInvitationReceivedHandlerService } from './notification-handlers/game-invitation-received-handler.service';
import { GameInvitationRejectedHandlerService } from './notification-handlers/game-invitation-rejected-handler.service';
import { NextTurnHandlerService } from './notification-handlers/next-turn-handler.service';
import { PingRequestedHandlerService } from './notification-handlers/ping-requested-handler.service';
import { RemovedFromFriendsHandlerService } from './notification-handlers/removed-from-friends-handler.service';
import { ResolutionPhaseHandlerService } from './notification-handlers/resolution-phase-handler.service';
import { StartGameHandlerService } from './notification-handlers/start-game-handler.service';
import { SurrenderHandlerService } from './notification-handlers/surrender-handler.service';
import { WebSocketAPI } from './websocket-api';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(
    private tokenService: BearerTokenService,
    private userInfoService: UserInfoService,
    private nextTurnHandler: NextTurnHandlerService,
    private startGameHandler: StartGameHandlerService,
    private resolutionPhaseHandler: ResolutionPhaseHandlerService,
    private gameEndHandler: GameEndNotificationHandlerService,
    private surrenderHandler: SurrenderHandlerService,
    private drawRequestedHandler: DrawRequestedNotificationHandlerService,
    private drawAcceptedHandler: DrawAcceptedNotificationHandlerService,
    private drawRejectedHandler: DrawRejectedNotificationHandlerService,
    private friendsRequestReceivedHandler: FriendRequestReceivedHandlerService,
    private pingRequestedHandlerService: PingRequestedHandlerService,
    private friendActiveHandlerService: FriendActiveHandlerService,
    private friendListUpdatedHandler: FriendsListUpdatedHandlerService,
    private removedFromFriendListHandler: RemovedFromFriendsHandlerService,
    private gameInvitationReceivedHandler: GameInvitationReceivedHandlerService,
    private gameInvitationCancelledHandler: GameInvitationCancelledHandlerService,
    private gameInvitationAcceptedHandler: GameInvitationAcceptedHandlerService,
    private gameInvitationRejectedHandler: GameInvitationRejectedHandlerService
  ) {}

  webSocketApi: WebSocketAPI | null = null;

  requireServerNotifications(): void {
    if (this.webSocketApi !== null) {
      return;
    }
    this.userInfoService.getStateUpdates().subscribe((info) => {
      const id = info.id;
      if (this.webSocketApi === null || this.webSocketApi.userId !== id) {
        this.webSocketApi = new WebSocketAPI(id, this.tokenService.getToken(), [
          this.nextTurnHandler,
          this.startGameHandler,
          this.resolutionPhaseHandler,
          this.gameEndHandler,
          this.surrenderHandler,
          this.drawRequestedHandler,
          this.drawAcceptedHandler,
          this.drawRejectedHandler,
          this.friendsRequestReceivedHandler,
          this.pingRequestedHandlerService,
          this.friendActiveHandlerService,
          this.friendListUpdatedHandler,
          this.removedFromFriendListHandler,
          this.gameInvitationReceivedHandler,
          this.gameInvitationCancelledHandler,
          this.gameInvitationAcceptedHandler,
          this.gameInvitationRejectedHandler,
        ]);
        this.webSocketApi.connect();
      }
    });
    this.userInfoService.requestState();
  }
}
