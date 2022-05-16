import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable, combineLatestWith, map } from 'rxjs';
import { Game, ResourceSet } from 'src/app/models/game-models';
import { UsersData } from 'src/app/models/profile-models.';
import { GameStateService } from 'src/app/services/http/game-state.service';
import { UserInfoService } from 'src/app/services/http/user-info.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
})
export class ResourcesComponent implements OnInit {
  constructor(
    private gameService: GameStateService,
    private usersService: UserInfoService
  ) {}

  userId: string = null;
  resourceSet: ResourceSet = {
    metal: null,
    buildingMaterials: null,
    electricity: null,
  };

  ngOnInit(): void {
    this.usersService
      .getStateUpdates()
      .pipe(combineLatestWith(this.gameService.getStateUpdates()))
      .subscribe((pair) => {
        const usersData: UsersData = pair[0];
        const gameData: Game = pair[1];
        const player = gameData.players.filter((p) => p.id === usersData.id)[0];
        this.resourceSet = player?.resources;
      });

    this.usersService.requestState();
    this.gameService.requestState();
  }
}
