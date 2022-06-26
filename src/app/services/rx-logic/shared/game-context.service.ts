import { Injectable } from '@angular/core';
import { PlayersAction } from 'src/app/models/actions';
import { GameBalanceConfig } from 'src/app/models/game-config-models';
import { Game } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import { UsersData } from 'src/app/models/profile-models.';
import { GameBalanceService } from '../../http/game-balance.service';
import { GameStateService } from '../../http/game-state.service';
import { UserInfoService } from '../../http/user-info.service';
import { CurrentActionsService } from './current-actions.service';
import { ResourceProcessor } from '../templates/resource-processor';

@Injectable({
  providedIn: 'root',
})
export class GameContextService extends ResourceProcessor<GameContext> {
  constructor(
    private gameStateService: GameStateService,
    private userInfoService: UserInfoService,
    private gameBalanceService: GameBalanceService,
    private currentActionsService: CurrentActionsService
  ) {
    super([
      gameStateService,
      userInfoService,
      gameBalanceService,
      currentActionsService,
    ]);
  }

  protected processData(dataElements: any[]): GameContext {
    const [game, usersData, balance, currentActions] = dataElements as [
      Game,
      UsersData,
      GameBalanceConfig,
      Array<PlayersAction<any>>
    ];
    const player = game.players.find((p) => p.id === usersData.id);
    const opponent = game.players.find((p) => p.id !== usersData.id);
    return {
      game,
      player,
      opponent,
      balance,
      currentActions,
    };
  }
}
