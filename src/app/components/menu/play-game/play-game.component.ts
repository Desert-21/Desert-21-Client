import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { formatSecondsToTimeString, millisecondsFrom, millisecondsTo } from 'src/app/utils/date-utils';

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.scss']
})
export class PlayGameComponent implements OnInit {

  isAddToQueueLoading: boolean = false;
  isAddToQueueDisabled: boolean = false;

  isCancelQueueLoading: boolean = false;

  isInTheQueue: boolean = false;
  timeOfEnteringQueue: Date | null = null;
  timeString: string = '00:00';
  interval: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  addToTheQueue() {
    this.isAddToQueueLoading = true;
    this.isAddToQueueDisabled = true;
    this.http.post('/queue', {}).subscribe({
      next: resp => {
        this.isInTheQueue = true;
        this.timeOfEnteringQueue = new Date();
        this.interval = setInterval(() => this.updateTimer(), 1000);
        //trigger stuff
      },
      error: err => {
        this.isAddToQueueDisabled = false;
      },
      complete: () => {
        this.isAddToQueueLoading = false;
      }
    });
  }

  cancelQueue() {
    this.isCancelQueueLoading = true;
    this.http.post('/queue/cancel', {}).subscribe({
      next: resp => {
        this.isInTheQueue = false;
        this.isAddToQueueDisabled = false;
      },
      complete: () => {
        this.isCancelQueueLoading = false;
      }
    })
  }

  updateTimer() {
    const ms = millisecondsFrom(this.timeOfEnteringQueue);
    const seconds = Math.floor(ms / 1000);
    this.timeString = formatSecondsToTimeString(seconds)
  }
}
