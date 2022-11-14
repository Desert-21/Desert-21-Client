import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';

@Component({
  selector: 'app-players-nicknames',
  templateUrl: './players-nicknames.component.html',
  styleUrls: ['./players-nicknames.component.scss'],
})
export class PlayersNicknamesComponent implements OnInit, OnDestroy {
  constructor(private gameContextService: GameContextService) {}

  ownedNickname: string = null;

  rating1 = 300;
  rating2 = 300;
  nickname1 = '';
  nickname2 = '';

  private sub1: Subscription;

  ngOnInit(): void {
    this.sub1 = this.gameContextService.getStateUpdates().subscribe((context) => {
      const { game, player } = context;
      const nicknames = game.players
        .map((p) => p.nickname)
        .map((n) => (n === player.nickname ? `${n} (You)` : n));
      this.nickname1 = nicknames[0];
      this.nickname2 = nicknames[1];
      this.rating1 = game.players[0].rating;
      this.rating2 = game.players[1].rating;
    });
    this.gameContextService.requestState();
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
