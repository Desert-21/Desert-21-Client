import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  AppNotification,
  ResolutionPhaseNotification,
  ResolutionPhaseNotificationContent,
} from 'src/app/models/notification-models';
import { ResolutionPhaseDataService } from 'src/app/services/rx-logic/resolution-phase/resolution-phase-data.service';

type TimeMapEntry = {
  msFromStart: number;
  notification: AppNotification<ResolutionPhaseNotificationContent>;
};

@Component({
  selector: 'app-resolution-phase-modal',
  templateUrl: './resolution-phase-modal.component.html',
  styleUrls: ['./resolution-phase-modal.component.scss'],
})
export class ResolutionPhaseModalComponent implements OnInit, OnDestroy {
  notification: ResolutionPhaseNotification = {
    timeout: new Date(),
    notifications: [],
  };
  currentNotification: AppNotification<ResolutionPhaseNotificationContent> | null =
    null;

  isProgressBarVisible = false;
  isCrossButtonAvailable = true;
  currentProgress = 0;
  currentInterval = null;
  timeMap: Array<TimeMapEntry> = [];

  @Input() modal: any;

  sub1: Subscription;

  constructor(private resolutionPhaseDataService: ResolutionPhaseDataService) {}
  ngOnInit(): void {
    this.sub1 = this.resolutionPhaseDataService
      .getStateUpdates()
      .subscribe((data) => {
        this.notification = data;
        this.performSlideShow();
      });
    this.resolutionPhaseDataService.requestState();
  }

  private performSlideShow(): void {
    this.isCrossButtonAvailable = false;
    const timeout = new Date(this.notification.timeout);
    const startingTime = new Date();
    const millisecondsBetween = timeout.getTime() - startingTime.getTime();
    this.timeMap = this.constructSlidesTimeMap(millisecondsBetween);
    this.currentProgress = 0;
    this.currentInterval = setInterval(() => {
      const currentTime = new Date();
      const timeFromBeginning = currentTime.getTime() - startingTime.getTime();
      this.currentNotification = this.chooseCurrentSlide(timeFromBeginning);
      const ratio = timeFromBeginning / millisecondsBetween;
      const percentRatio = Math.round(ratio * 100);
      this.currentProgress = percentRatio;
      if (this.currentProgress >= 100) {
        clearInterval(this.currentInterval);
        this.isCrossButtonAvailable = true;
        this.closeModalDelayed();
      }
    }, 50);
    this.isProgressBarVisible = true;
  }

  private closeModalDelayed(): void {
    setTimeout(() => {
      this.modal.close('');
    }, 8000);
  }

  private chooseCurrentSlide(
    msFromStart: number
  ): AppNotification<ResolutionPhaseNotificationContent> {
    for (const slide of this.timeMap) {
      if (slide.msFromStart > msFromStart) {
        return slide.notification;
      }
    }
    return null;
  }

  private constructSlidesTimeMap(millisecondsBetween: number): Array<any> {
    const totalRequiredTime = this.notification.notifications
      .map((n) => n.content.millisecondsToView)
      .reduce((prev, next) => prev + next, 0);
    const availableTimeRatio = millisecondsBetween / totalRequiredTime;
    this.notification.notifications.forEach(
      (n) =>
        (n.content.millisecondsToView = Math.round(
          n.content.millisecondsToView * availableTimeRatio
        ))
    );
    const accumulator: Array<TimeMapEntry> = [];
    let currentTimeout = 0;
    for (const notification of this.notification.notifications) {
      const timeout = notification.content.millisecondsToView;
      currentTimeout = currentTimeout + timeout;
      accumulator.push({ msFromStart: currentTimeout, notification });
    }
    return accumulator;
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
