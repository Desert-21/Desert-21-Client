import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PlayersAction } from 'src/app/models/actions';
import { GameTurnRequest } from 'src/app/models/game-utility-models';
import { GameStateService } from 'src/app/services/http/game-state.service';
import { UserInfoService } from 'src/app/services/http/user-info.service';
import { CurrentActionsService } from 'src/app/services/rx-logic/current-actions.service';
import { GameContextService } from 'src/app/services/rx-logic/game-context.service';
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
export class TurnTimerButtonComponent implements OnInit {
  timeOfNextTurn: Date = new Date();
  timeDisplay = '00:00';

  buttonDisplay = '...';

  isMyTurn: boolean | null = null;

  gameId: string | null = null;

  currentActions: Array<PlayersAction<any>> = [];

  currentOnClick: () => void = () => {};

  constructor(
    private gameStateService: GameStateService,
    private userInfoService: UserInfoService,
    private http: HttpClient,
    private gameContextService: GameContextService,
    private currentActionsService: CurrentActionsService
  ) {}

  ngOnInit(): void {
    this.gameContextService.getStateUpdates().subscribe((context) => {
      const game = context.game;
      const { currentPlayerId, gameState, timeout } = game.stateManager;

      if (currentPlayerId === null) {
        this.isMyTurn = null;
      } else {
        this.isMyTurn = currentPlayerId === context.player.id;
      }
      this.timeOfNextTurn = parseDate(timeout);
      this.buttonDisplay = this.getButtonText(gameState);
      this.gameId = game.gameId;
      console.log(game);

      this.currentActions = context.currentActions;

      this.currentOnClick = this.getCurrentOnClick(this.isMyTurn, gameState);
    });
    this.gameContextService.requestState();
    this.tickTheTime();
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
    this.http.post('/games/turns', gameTurnRequest).subscribe((resp) => {
      console.log(resp);
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

  private getButtonText(state: string): string {
    switch (state) {
      case 'WAITING_TO_START':
        return 'Ready!';
      case 'AWAITING':
        return this.isMyTurn ? 'End Turn' : 'Opponents Turn';
      default:
        return 'UNKNOWN!';
    }
  }
}
