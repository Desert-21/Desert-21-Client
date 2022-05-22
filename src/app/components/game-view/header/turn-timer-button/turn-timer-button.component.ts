import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GameStateService } from 'src/app/services/http/game-state.service';
import { UserInfoService } from 'src/app/services/http/user-info.service';
import { GameContextService } from 'src/app/services/rx-logic/game-context.service';
import {
  formatSecondsToTimeString,
  millisecondsTo,
  parseDate,
  timeStringToTotalSeconds
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

  constructor(
    private gameStateService: GameStateService,
    private userInfoService: UserInfoService,
    private http: HttpClient,
    private gameContextService: GameContextService
  ) {}

  ngOnInit(): void {
    this.gameContextService.getStateUpdates().subscribe((context) => {
      const game = context.game;
      const stateManager = game.stateManager;
      const currentPlayerId = stateManager.currentPlayerId;
      if (currentPlayerId === null) {
        this.isMyTurn = null;
      } else {
        this.isMyTurn = currentPlayerId === context.player.id;
      }
      this.timeOfNextTurn = parseDate(stateManager.timeout);
      this.buttonDisplay = this.getButtonText(stateManager.gameState);
      this.gameId = game.id;
    });
    this.gameContextService.requestState();
    this.tickTheTime();
  }

  notifyAboutGameReadiness(): void {
    this.http.post('/gameReadiness', this.gameId).subscribe((resp) => {});
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
