import { Component, OnInit } from '@angular/core';
import { combineLatestWith } from 'rxjs';
import { Game } from 'src/app/models/game-models';
import { UsersData } from 'src/app/models/profile-models.';
import { GameStateService } from 'src/app/services/game-state.service';
import { UserInfoService } from 'src/app/services/user-info.service';

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

  nickname1: string = '';
  nickname2: string = '';

  ngOnInit(): void {
    this.usersService
      .getUsersDataUpdates()
      .pipe(combineLatestWith(this.gameService.getGameStateUpdates()))
      .subscribe((pair) => {
        let usersData: UsersData = pair[0];
        let gameData: Game = pair[1];
        let nicknames = gameData.players
          .map((p) => p.nickname)
          .map((n) => (n === usersData.nickname ? `${n} (You)` : n));
        this.nickname1 = nicknames[0];
        this.nickname2 = nicknames[1];
      });
    this.usersService.requestUsersData();
    this.gameService.requestGameState();
  }
}
