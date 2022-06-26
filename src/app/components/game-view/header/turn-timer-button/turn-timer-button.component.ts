import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlayersAction } from 'src/app/models/actions';
import { GameTurnRequest } from 'src/app/models/game-utility-models';
import { GameStateService } from 'src/app/services/http/game-state.service';
import { UserInfoService } from 'src/app/services/http/user-info.service';
import { CurrentActionsService } from 'src/app/services/rx-logic/shared/current-actions.service';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import {
  formatSecondsToTimeString,
  millisecondsTo,
  parseDate,
  timeStringToTotalSeconds,
} from 'src/app/utils/date-utils';

@Component({
  selector: 'app-turn-timer-button',
  templateUrl: './turn-timer-button.component.html',
  styleUrls: ['./turn-timer-button.component.scss'],
})
export class TurnTimerButtonComponent implements OnInit, OnDestroy {
  timeOfNextTurn: Date = new Date();
  timeDisplay = '00:00';

  buttonDisplay = '...';

  isButtonDisabled = false;

  gameId: string | null = null;

  currentActions: Array<PlayersAction<any>> = [];

  private sub1: Subscription;

  currentOnClick: () => void = () => {};

  constructor(
    private gameStateService: GameStateService,
    private userInfoService: UserInfoService,
    private http: HttpClient,
    private gameContextService: GameContextService,
    private currentActionsService: CurrentActionsService
  ) {}

  ngOnInit(): void {
    this.sub1 = this.gameContextService
      .getStateUpdates()
      .subscribe((context) => {
        const game = context.game;
        const { currentPlayerId, gameState, timeout } = game.stateManager;
        const isMyTurn =
          currentPlayerId === null
            ? null
            : currentPlayerId === context.player.id;

        this.timeOfNextTurn = parseDate(timeout);
        this.buttonDisplay = this.getButtonText(gameState, isMyTurn);
        this.gameId = game.gameId;

        this.currentActions = context.currentActions;

        this.currentOnClick = this.getCurrentOnClick(isMyTurn, gameState);

        this.isButtonDisabled = this.getIsButtonDisabled(gameState, isMyTurn);
      });
    this.gameContextService.requestState();
    this.tickTheTime();
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }

  notifyAboutGameReadiness(): void {
    this.http.post('/gameReadiness', this.gameId).subscribe((resp) => {});
  }

  endTurn(): void {
    const actionRequests = this.currentActions.map((a) => a.toActionAPIBody());
    const gameTurnRequest: GameTurnRequest = {
      gameId: this.gameId,
      actions: actionRequests,
    };
    console.log(actionRequests);
    this.http.post('/games/turns', gameTurnRequest).subscribe((resp) => {
      this.currentActionsService.clearActions();
    });
  }

  private getCurrentOnClick(isMyTurn: boolean, gameState: string): () => void {
    if (gameState === 'AWAITING' && isMyTurn) {
      return this.endTurn;
    }
    if (gameState === 'WAITING_TO_START') {
      return this.notifyAboutGameReadiness;
    }
    return () => {};
  }

  private dateToRemainingTimeString(): string {
    const msNextTurn = this.timeOfNextTurn?.getTime();
    const msNow = new Date().getTime();
    if (msNextTurn <= msNow) {
      return '00:00';
    }
    const secToNextTurn = (msNextTurn - msNow) / 1000;
    return formatSecondsToTimeString(secToNextTurn);
  }

  private async tickTheTime(): Promise<void> {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    return new Promise(async (res, rej) => {
      while (true) {
        await delay(this.getTimeToWait());
        this.timeDisplay = this.dateToRemainingTimeString();
      }
    });
  }

  private getTimeToWait(): number {
    const currentRemainingSeconds = timeStringToTotalSeconds(this.timeDisplay);
    const nextRemainingSeconds = currentRemainingSeconds - 1;
    const millisecondsToEndOfTurn = millisecondsTo(this.timeOfNextTurn);
    const nextRemainingMilliseconds = nextRemainingSeconds * 1000;
    return millisecondsToEndOfTurn - nextRemainingMilliseconds - 200;
  }

  private getButtonText(state: string, isMyTurn: boolean): string {
    switch (state) {
      case 'WAITING_TO_START':
        return 'Ready!';
      case 'AWAITING':
        return isMyTurn ? 'End Turn' : 'Opponents Turn';
      case 'RESOLVED':
        return 'Wait...';
      default:
        return 'UNKNOWN!';
    }
  }

  private getIsButtonDisabled(state: string, isMyTurn: boolean): boolean {
    return state !== 'WAITING_TO_START' && !(state === 'AWAITING' && isMyTurn);
  }
}
