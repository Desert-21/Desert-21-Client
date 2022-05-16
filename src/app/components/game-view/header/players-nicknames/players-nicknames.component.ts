import { Component, OnInit } from '@angular/core';
import { combineLatestWith } from 'rxjs';
import { Game } from 'src/app/models/game-models';
import { UsersData } from 'src/app/models/profile-models.';
import { GameStateService } from 'src/app/services/http/game-state.service';
import { UserInfoService } from 'src/app/services/http/user-info.service';

@Component({
  selector: 'app-players-nicknames',
  templateUrl: './players-nicknames.component.html',
  styleUrls: ['./players-nicknames.component.scss'],
})
export class PlayersNicknamesComponent implements OnInit {
  constructor(
    private gameService: GameStateService,
    private usersService: UserInfoService
  ) {}

  ownedNickname: string = null;

  nickname1 = '';
  nickname2 = '';

  ngOnInit(): void {
    this.usersService
      .getStateUpdates()
      .pipe(combineLatestWith(this.gameService.getStateUpdates()))
      .subscribe((pair) => {
        const usersData: UsersData = pair[0];
        const gameData: Game = pair[1];
        const nicknames = gameData.players
          .map((p) => p.nickname)
          .map((n) => (n === usersData.nickname ? `${n} (You)` : n));
        this.nickname1 = nicknames[0];
        this.nickname2 = nicknames[1];
      });
    this.usersService.requestState();
    this.gameService.requestState();
  }
}
