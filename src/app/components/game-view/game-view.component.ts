import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BearerTokenService } from 'src/app/services/bearer-token.service';
import { GameIdService } from 'src/app/services/game-id.service';
import { GameStateService } from 'src/app/services/http/game-state.service';
import { GameBalanceService } from 'src/app/services/http/game-balance.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { UserInfoService } from 'src/app/services/http/user-info.service';
import { WebSocketAPI } from 'src/app/services/websocket-api';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss'],
})
export class GameViewComponent implements OnInit {
  constructor(
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private gameIdService: GameIdService,
    private gameStateService: GameStateService,
    private gameBalanceService: GameBalanceService
  ) {}
  ngOnInit(): void {
    this.notificationsService.requireServerNotifications();

    this.route.params.subscribe((params) => {
      var gameId = params['gameId'];
      this.gameIdService.saveId(gameId);

      this.gameStateService.requestState();
    });

    this.gameBalanceService.getStateUpdates().subscribe(resp => {
      console.log(resp);
    });
    this.gameBalanceService.requestState();

  }
}
