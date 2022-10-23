import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import { GameResultService, WinLooseDraw } from 'src/app/services/rx-logic/shared/game-result.service';

@Component({
  selector: 'app-game-end-modal',
  templateUrl: './game-end-modal.component.html',
  styleUrls: ['./game-end-modal.component.scss'],
})
export class GameEndModalComponent implements OnInit, OnDestroy {
  @Input() modal: any;

  state: WinLooseDraw = 'NEUTRAL';
  hasOpponentSurrenderedText = '';
  modalTitle = '';
  modalTitleClass = '';
  gameTurn = 0;

  sub1: Subscription;

  constructor(
    private gameContextService: GameContextService,
    private gameResultService: GameResultService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub1 = combineLatest([
      this.gameContextService.getStateUpdates(),
      this.gameResultService.getStateUpdates(),
    ]).subscribe(([context, { state, bySurrender }]) => {
      this.state = state;
      switch (state) {
        case 'DRAW':
          this.modalTitle = 'Draw!';
          this.modalTitleClass = 'text-warning';
          this.hasOpponentSurrenderedText = '';
          break;
        case 'LOOSE':
          this.modalTitle = 'You lost!';
          this.modalTitleClass = 'text-danger';
          this.hasOpponentSurrenderedText = '';
          break;
        case 'WIN':
          this.modalTitle = 'You won!';
          this.modalTitleClass = 'text-success';
          this.hasOpponentSurrenderedText = bySurrender
            ? 'You opponent has surrendered.'
            : '';
          break;
      }
      this.gameTurn = context.game.stateManager.turnCounter;
    });
    this.gameContextService.requestState();
    this.gameResultService.requestState();
  }

  redirectToMainMenu(): void {
    this.modal.close('');
    this.router.navigate(['menu']);
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
