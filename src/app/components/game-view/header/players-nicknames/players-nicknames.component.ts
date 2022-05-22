import { Component, OnInit } from '@angular/core';
import { GameContextService } from 'src/app/services/rx-logic/game-context.service';

@Component({
  selector: 'app-players-nicknames',
  templateUrl: './players-nicknames.component.html',
  styleUrls: ['./players-nicknames.component.scss'],
})
export class PlayersNicknamesComponent implements OnInit {
  constructor(private gameContextService: GameContextService) {}

  ownedNickname: string = null;

  nickname1 = '';
  nickname2 = '';

  ngOnInit(): void {
    this.gameContextService.getStateUpdates().subscribe((context) => {
      const { game, player } = context;
      const nicknames = game.players
        .map((p) => p.nickname)
        .map((n) => (n === player.nickname ? `${n} (You)` : n));
      this.nickname1 = nicknames[0];
      this.nickname2 = nicknames[1];
    });
    this.gameContextService.requestState();
  }
}
