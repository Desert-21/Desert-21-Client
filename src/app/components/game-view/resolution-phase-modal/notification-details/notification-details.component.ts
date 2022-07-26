import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  AppNotification,
  NotificationType,
  ResolutionPhaseNotificationContent,
} from 'src/app/models/notification-models';

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.component.html',
  styleUrls: ['./notification-details.component.scss'],
})
export class NotificationDetailsComponent implements OnInit {
  @Input()
  notification: AppNotification<ResolutionPhaseNotificationContent>;

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

  constructor() {}

  ngOnInit(): void {}
}
