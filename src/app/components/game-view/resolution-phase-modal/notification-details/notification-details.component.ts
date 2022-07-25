import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  AppNotification,
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

  constructor() {}

  ngOnInit(): void {}
}
