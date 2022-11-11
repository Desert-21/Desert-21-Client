import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StartGameHandlerService } from 'src/app/services/notification-handlers/start-game-handler.service';
import { PlayerInvitedService } from 'src/app/services/rx-logic/menu/player-invited.service';
import { ToastsService } from 'src/app/services/rx-logic/shared/toasts.service';

@Component({
  selector: 'app-waiting-for-game-readiness-modal',
  templateUrl: './waiting-for-game-readiness-modal.component.html',
  styleUrls: ['./waiting-for-game-readiness-modal.component.scss'],
})
export class WaitingForGameReadinessModalComponent
  implements OnInit, OnDestroy
{
  @Input()
  modal: any;

  opponentsNickname = '';

  private timeout: any;

  private sub1: Subscription;
  private sub2: Subscription;

  constructor(
    private invitedPlayerService: PlayerInvitedService,
    private startGameHandler: StartGameHandlerService,
    private router: Router,
    private toastsService: ToastsService
  ) {}

  ngOnInit(): void {
    this.timeout = setTimeout(() => {
      this.modal.close('');
      this.toastsService.add({
        title: 'Game Cancelled',
        description: 'Player has quit the game before confirming readiness',
        theme: 'WARNING',
      });
    }, 15_000);
    this.sub1 = this.invitedPlayerService
      .getStateUpdates()
      .subscribe(({ opponentsNickname }) => {
        this.opponentsNickname = opponentsNickname;
      });
    this.sub2 = this.startGameHandler.getStartGameUpdates().subscribe((id) => {
      this.modal.close('');
      this.router.navigate(['game', id]);
    });
    this.invitedPlayerService.requestState();
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }
}
