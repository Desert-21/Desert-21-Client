import { Injectable } from '@angular/core';
import { BoardLocation, Game } from '../../models/game-models';
import { FieldSelection } from '../../models/game-utility-models';
import { UsersData } from '../../models/profile-models.';
import { GameStateService } from '../http/game-state.service';
import { UserInfoService } from '../http/user-info.service';
import { LocationSelectionService } from './location-selection.service';
import { ResourceProcessor } from './resource-processor';

@Injectable({
  providedIn: 'root',
})
export class SelectedFieldService extends ResourceProcessor<FieldSelection | null> {
  constructor(
    private gameStateService: GameStateService,
    private locationSelectionService: LocationSelectionService,
    private userInfoService: UserInfoService
  ) {
    super([gameStateService, locationSelectionService, userInfoService]);
  }

  protected processData(dataElements: any[]): FieldSelection | null {
    const [gameState, selectedLocation, usersData] = dataElements as [
      Game,
      BoardLocation,
      UsersData
    ];
    if (!gameState || !selectedLocation) {
      return null;
    }
    const field = gameState.fields[selectedLocation.row][selectedLocation.col];
    const isOwned = field.ownerId === usersData.id;
    const isEnemy =
      !isOwned && gameState.players.map((p) => p.id).includes(field.ownerId);
    return {
      field,
      row: selectedLocation.row,
      col: selectedLocation.col,
      isOwned,
      isEnemy,
    };
  }
}
