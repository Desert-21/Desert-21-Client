import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  AppNotification,
  NotificationType,
  ResolutionPhaseNotificationContent,
} from 'src/app/models/notification-models';
import { AnimatedSlideWrapperComponent } from '../animated-slide-wrapper/animated-slide-wrapper.component';

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.component.html',
  styleUrls: ['./notification-details.component.scss'],
})
export class NotificationDetailsComponent implements OnInit {
  @ViewChild('slideWrapper')
  slideWrapper: AnimatedSlideWrapperComponent;

  private _notification: AppNotification<ResolutionPhaseNotificationContent>;

  bombardingNotifications: Array<NotificationType> = [
    'ENEMY_BOMBARDING_FAILED',
    'ENEMY_BOMBARDING_SUCCEEDED',
    'PLAYER_BOMBARDING_FAILED',
    'PLAYER_BOMBARDING_SUCCEEDED',
  ];

  battleAgainstScarabsNotifications: Array<NotificationType> = [
    'UNOCCUPIED_FIELD_ENEMY_CONQUEST_FAILED',
    'UNOCCUPIED_FIELD_ENEMY_CONQUEST_SUCCEEDED',
    'UNOCCUPIED_FIELD_PLAYERS_CONQUEST_FAILED',
    'UNOCCUPIED_FIELD_PLAYERS_CONQUEST_SUCCEEDED',
  ];

  battleAgainstPlayerNotification: Array<NotificationType> = [
    'ENEMY_CONQUEST_FAILED',
    'PLAYERS_CONQUEST_FAILED',
    'ENEMY_CONQUEST_SUCCEEDED',
    'PLAYERS_CONQUEST_SUCCEEDED',
  ];

  constructor() {}

  ngOnInit(): void {}

  get notification(): AppNotification<ResolutionPhaseNotificationContent> {
    return this._notification;
  }

  @Input()
  set notification(
    notification: AppNotification<ResolutionPhaseNotificationContent>
  ) {
    if (!this.notification) {
      this._notification = notification;
      return;
    }
    this.slideWrapper?.rollRight();
    setTimeout(() => {
      this._notification = notification;
    }, 400);
  }
}
