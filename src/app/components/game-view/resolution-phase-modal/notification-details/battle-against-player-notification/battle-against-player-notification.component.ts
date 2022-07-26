import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  AppNotification,
  FieldConquestFullPictureNotification,
  FieldConquestNoInfoNotification,
} from 'src/app/models/notification-models';

@Component({
  selector: 'app-battle-against-player-notification',
  templateUrl: './battle-against-player-notification.component.html',
  styleUrls: ['./battle-against-player-notification.component.scss'],
})
export class BattleAgainstPlayerNotificationComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}


}
