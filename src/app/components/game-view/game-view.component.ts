import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BearerTokenService } from 'src/app/services/bearer-token.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { UserInfoService } from 'src/app/services/user-info.service';
import { WebSocketAPI } from 'src/app/services/websocket-api';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent implements OnInit {

  constructor(private notificationsService: NotificationsService) {

  }
  ngOnInit(): void {
    this.notificationsService.requireServerNotifications();
  }
}
