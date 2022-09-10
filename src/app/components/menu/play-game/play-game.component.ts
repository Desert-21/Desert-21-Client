import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorService } from 'src/app/services/error.service';
import { StartGameHandlerService } from 'src/app/services/notification-handlers/start-game-handler.service';
import {
  formatSecondsToTimeString,
  millisecondsFrom,
} from 'src/app/utils/date-utils';

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.scss'],
})
export class PlayGameComponent implements OnInit, OnDestroy {
  isAddToQueueLoading = false;
  isAddToQueueDisabled = false;

  isCancelQueueLoading = false;

  isInTheQueue = false;
  timeOfEnteringQueue: Date | null = null;
  timeString = '00:00';
  interval: any;

  private sub1: Subscription;

  constructor(
    private http: HttpClient,
    private startGameHandler: StartGameHandlerService,
    private router: Router,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.sub1 = this.startGameHandler.getStartGameUpdates().subscribe({
      next: (id) => {
        this.isInTheQueue = false;
        this.isAddToQueueDisabled = true;
        this.isCancelQueueLoading = false;
        this.router.navigate(['game', id]);
      },
    });
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }

  addToTheQueue(): void {
    this.isAddToQueueLoading = true;
    this.isAddToQueueDisabled = true;
    this.http.post('/queue', {}).subscribe({
      next: (resp) => {
        this.isInTheQueue = true;
        this.timeOfEnteringQueue = new Date();
        this.interval = setInterval(() => this.updateTimer(), 1000);
        // trigger stuff
      },
      error: (err) => {
        this.isAddToQueueDisabled = false;
        this.errorService.showError(
          'Could not add you to the queue. Try again later!'
        );
      },
      complete: () => {
        this.isAddToQueueLoading = false;
      },
    });
  }

  cancelQueue(): void {
    this.isCancelQueueLoading = true;
    this.http.post('/queue/cancel', {}).subscribe({
      next: (resp) => {
        this.isInTheQueue = false;
        this.isAddToQueueDisabled = false;
      },
      error: () => {
        this.errorService.showError(
          'Something went wrong when removing you from the queue. You probably weren\'t even there!'
        );
      },
      complete: () => {
        this.isCancelQueueLoading = false;
      },
    });
  }

  updateTimer(): void {
    const ms = millisecondsFrom(this.timeOfEnteringQueue);
    const seconds = Math.floor(ms / 1000);
    this.timeString = formatSecondsToTimeString(seconds);
  }
}
