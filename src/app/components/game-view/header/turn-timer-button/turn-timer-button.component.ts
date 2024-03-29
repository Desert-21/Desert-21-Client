import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { PlayersAction } from 'src/app/models/actions';
import { GameTurnRequest } from 'src/app/models/game-utility-models';
import { ErrorService } from 'src/app/services/error.service';
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

  shouldContinueTicking = true;

  hasNotifiedAboutGameReadiness = new BehaviorSubject<boolean>(false);

  hasStartedTurnExecution = new BehaviorSubject<boolean>(false);

  canCallForTurnExecution = false;

  private sub1: Subscription;

  currentOnClick: () => void = () => {};

  constructor(
    private http: HttpClient,
    private gameContextService: GameContextService,
    private currentActionsService: CurrentActionsService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.sub1 = combineLatest([
      this.gameContextService.getStateUpdates(),
      this.hasNotifiedAboutGameReadiness.asObservable(),
      this.hasStartedTurnExecution.asObservable(),
    ]).subscribe(
      ([
        context,
        hasAlreadyNotifiedAboutReadiness,
        hasStartedTurnExecution,
      ]) => {
        const game = context.game;
        const { currentPlayerId, gameState, timeout } = game.stateManager;
        const isMyTurn =
          currentPlayerId === null
            ? null
            : currentPlayerId === context.player.id;

        this.timeOfNextTurn = parseDate(timeout);
        this.buttonDisplay = this.getButtonText(
          gameState,
          isMyTurn,
          hasStartedTurnExecution
        );
        this.gameId = game.gameId;

        this.currentActions = context.currentActions;

        this.currentOnClick = this.getCurrentOnClick(isMyTurn, gameState);

        this.isButtonDisabled = this.getIsButtonDisabled(
          gameState,
          isMyTurn,
          hasAlreadyNotifiedAboutReadiness,
          hasStartedTurnExecution
        );

        this.canCallForTurnExecution =
          !this.isButtonDisabled &&
          isMyTurn &&
          game.stateManager.gameState === 'AWAITING';
      }
    );
    this.gameContextService.requestState();
    this.tickTheTime();
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
    this.shouldContinueTicking = false;
  }

  notifyAboutGameReadiness(): void {
    this.hasNotifiedAboutGameReadiness.next(true);
    this.http.post('/game-readiness', this.gameId).subscribe({
      next: (resp) => {},
      error: (err) => {
        this.hasNotifiedAboutGameReadiness.next(false);
        this.errorService.showError(
          'Could not notify about game readiness! Is it too late?'
        );
      },
    });
  }

  endTurn(): void {
    console.log('ENDING TURN');
    this.hasStartedTurnExecution.next(true);
    const actionRequests = this.currentActions.map((a) => a.toActionAPIBody());
    const gameTurnRequest: GameTurnRequest = {
      gameId: this.gameId,
      actions: actionRequests,
    };
    console.log('REQUEST:', gameTurnRequest);
    this.http.post('/games/turns', gameTurnRequest).subscribe({
      next: (resp) => {
        this.currentActionsService.clearActions();
        this.hasStartedTurnExecution.next(false);
      },
      error: (err) => {
        this.hasStartedTurnExecution.next(false);
        this.errorService.showError(
          'You should NOT see this error. If you see it, congrats! It means, that you are either trying to cheat in this game or there is a real bug in the webpage. The game interface allowed you for performing an action that server correctly rejected - this should never actually take place! Wanna do me a favor? Please contact me and inform about what just happened. Thanks!'
        );
      },
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

  private getRemainingSeconds(): number {
    const msNextTurn = this.timeOfNextTurn?.getTime();
    const msNow = new Date().getTime();
    if (msNextTurn <= msNow) {
      return 0;
    }
    return (msNextTurn - msNow) / 1000;
  }

  private dateToRemainingTimeString(): string {
    const secToNextTurn = this.getRemainingSeconds();
    return formatSecondsToTimeString(secToNextTurn);
  }

  private async tickTheTime(): Promise<void> {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    return new Promise(async (res, rej) => {
      while (this.shouldContinueTicking) {
        const timeToWait = this.getTimeToWait();
        this.optionallyExecuteTurnLastSecond();
        await delay(timeToWait);
        this.timeDisplay = this.dateToRemainingTimeString();
      }
    });
  }

  private optionallyExecuteTurnLastSecond(): void {
    if (
      this.getRemainingSeconds() < 0.5 &&
      this.canCallForTurnExecution &&
      !this.hasStartedTurnExecution.getValue()
    ) {
      this.endTurn();
    }
  }

  private getTimeToWait(): number {
    const currentRemainingSeconds = timeStringToTotalSeconds(this.timeDisplay);
    const nextRemainingSeconds = currentRemainingSeconds - 1;
    const millisecondsToEndOfTurn = millisecondsTo(this.timeOfNextTurn);
    const nextRemainingMilliseconds = nextRemainingSeconds * 1000;
    const defaultMsToWait =
      millisecondsToEndOfTurn - nextRemainingMilliseconds - 200;
    return defaultMsToWait > 0 && defaultMsToWait < 2000
      ? defaultMsToWait
      : 200;
  }

  private getButtonText(
    state: string,
    isMyTurn: boolean,
    hasStartedTurnExecution: boolean
  ): string {
    if (hasStartedTurnExecution) {
      return 'Loading...';
    }
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

  private getIsButtonDisabled(
    state: string,
    isMyTurn: boolean,
    hasAlreadyNotifiedAboutReadiness: boolean,
    hasStartedTurnExecution: boolean
  ): boolean {
    if (hasStartedTurnExecution) {
      return true;
    }
    const canStillNotfiyAboutGameReadiness =
      state === 'WAITING_TO_START' && !hasAlreadyNotifiedAboutReadiness;
    return (
      !canStillNotfiyAboutGameReadiness && !(state === 'AWAITING' && isMyTurn)
    );
  }
}
