import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import { HasPLayerWonService } from 'src/app/services/rx-logic/shared/has-player-won.service';
import { HasWonBySurrenderService } from 'src/app/services/rx-logic/shared/has-won-by-surrender.service';

@Component({
  selector: 'app-game-end-modal',
  templateUrl: './game-end-modal.component.html',
  styleUrls: ['./game-end-modal.component.scss'],
})
export class GameEndModalComponent implements OnInit, OnDestroy {
  @Input() modal: any;

  hasPlayerWon = false;
  hasOpponentSurrenderedText = '';
  modalTitle = '';
  modalTitleClass = '';
  gameTurn = 0;

  sub1: Subscription;

  constructor(
    private gameContextService: GameContextService,
    private gameWinnerService: HasPLayerWonService,
    private router: Router,
    private hasWonBySurrenderService: HasWonBySurrenderService
  ) {}

  ngOnInit(): void {
    this.sub1 = combineLatest([
      this.gameContextService.getStateUpdates(),
      this.gameWinnerService.getStateUpdates(),
      this.hasWonBySurrenderService.getStateUpdates()
    ]).subscribe(([context, hasWon, bySurrender]) => {
      if (!hasWon) {
        this.modalTitle = 'You lost!';
        this.modalTitleClass = 'text-danger';
        this.hasPlayerWon = false;
        this.hasOpponentSurrenderedText = '';
      } else {
        this.modalTitle = 'You won!';
        this.modalTitleClass = 'text-success';
        this.hasPlayerWon = true;
        this.hasOpponentSurrenderedText = bySurrender ? 'You opponent has surrendered.' : '';
      }
      this.gameTurn = context.game.stateManager.turnCounter;
    });
    this.gameContextService.requestState();
    this.gameWinnerService.requestState();
    this.hasWonBySurrenderService.requestState();
  }

  redirectToMainMenu(): void {
    this.modal.close('');
    this.router.navigate(['menu']);

  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
