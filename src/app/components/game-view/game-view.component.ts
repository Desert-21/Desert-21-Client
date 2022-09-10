import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameIdService } from 'src/app/services/game-id.service';
import { GameBalanceService } from 'src/app/services/http/game-balance.service';
import { GameStateService } from 'src/app/services/http/game-state.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { MaxPowerService } from 'src/app/services/rx-logic/shared/max-power.service';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss'],
})
export class GameViewComponent implements OnInit, OnDestroy {
  private sub1: Subscription;

  constructor(
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private gameIdService: GameIdService,
    private gameStateService: GameStateService,
    private gameBalanceService: GameBalanceService,
    private maxPowerService: MaxPowerService
  ) // private gameModalService: GameModalService
  {}

  ngOnInit(): void {
    this.notificationsService.requireServerNotifications();

    this.sub1 = this.route.params.subscribe((params) => {
      const gameId = params.gameId;
      this.gameIdService.saveId(gameId);

      this.gameStateService.fetchState();
    });
    this.maxPowerService.requestState();
    this.gameBalanceService.requestState();

    // setTimeout(() => this.gameModalService.openModal('GAME_END'), 2000);
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
