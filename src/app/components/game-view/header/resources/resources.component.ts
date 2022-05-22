import { Component, OnInit } from '@angular/core';
import { ResourceSet } from 'src/app/models/game-models';
import { GameStateService } from 'src/app/services/http/game-state.service';
import { UserInfoService } from 'src/app/services/http/user-info.service';
import { GameContextService } from 'src/app/services/rx-logic/game-context.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
})
export class ResourcesComponent implements OnInit {
  constructor(
    private gameService: GameStateService,
    private usersService: UserInfoService,
    private gameContextService: GameContextService
  ) {}

  userId: string = null;
  resourceSet: ResourceSet = {
    metal: null,
    buildingMaterials: null,
    electricity: null,
  };

  ngOnInit(): void {
    this.gameContextService.getStateUpdates().subscribe((context) => {
      this.resourceSet = context.player.resources;
    });
    this.gameContextService.requestState();
  }
}
