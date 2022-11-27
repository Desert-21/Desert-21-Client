import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameInvitationCancelledHandlerService } from 'src/app/services/notification-handlers/game-invitation-cancelled-handler.service';
import { GameInvitationRejectedHandlerService } from 'src/app/services/notification-handlers/game-invitation-rejected-handler.service';
import { StartGameHandlerService } from 'src/app/services/notification-handlers/start-game-handler.service';
import { PlayerInvitedService } from 'src/app/services/rx-logic/menu/player-invited.service';
import { ToastsService } from 'src/app/services/rx-logic/shared/toasts.service';

@Component({
  selector: 'app-player-invited-modal',
  templateUrl: './player-invited-modal.component.html',
  styleUrls: ['./player-invited-modal.component.scss'],
})
export class PlayerInvitedModalComponent implements OnInit, OnDestroy {
  @Input()
  modal: any;

  opponentsNickname = '';
  invitationId = '';

  private sub1: Subscription;
  private sub2: Subscription;
  private sub3: Subscription;

  constructor(
    private playerInvitedService: PlayerInvitedService,
    private http: HttpClient,
    private startGameHandler: StartGameHandlerService,
    private router: Router,
    private gameInvitationRejectedHandler: GameInvitationRejectedHandlerService,
    private toastsService: ToastsService
  ) {}

  ngOnInit(): void {
    this.sub1 = this.playerInvitedService
      .getStateUpdates()
      .subscribe((info) => {
        this.opponentsNickname = info.opponentsNickname;
        this.invitationId = info.invitationId;
      });
    this.sub2 = this.startGameHandler.getStartGameUpdates().subscribe((id) => {
      this.modal.close('');
      this.router.navigate(['game', id]);
    });
    this.sub3 = this.gameInvitationRejectedHandler
      .getNotificationSignals()
      .subscribe((rejection) => {
        this.modal.close('');
        this.toastsService.add({
          title: 'Game Rejected',
          description: `Player ${rejection.playersNickname} rejected your invitation.`,
          theme: 'DANGER',
        });
      });
    this.playerInvitedService.requestState();
  }

  onCanceInvitationClick(): void {
    this.http
      .post(`/game-invitations/cancel/${this.invitationId}`, null)
      .subscribe(() => {});
    this.modal.close('');
  }

  ngOnDestroy(): void {
    this.playerInvitedService.reset();
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
  }
}
