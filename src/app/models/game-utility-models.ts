import { PlayersAction } from './actions';
import { GameBalanceConfig } from './game-config-models';
import { Field, Game, Player } from './game-models';

export type FieldSelection = {
  row: number;
  col: number;
  field: Field;
  isOwned: boolean;
  isEnemy: boolean;
};

export type GameContext = {
  game: Game;
  player: Player;
  opponent: Player;
  balance: GameBalanceConfig;
  currentActions: Array<PlayersAction<any>>;
};

export type CurrentGameResponse = {
  gameId: string;
};

export type GameTurnRequest = {
  gameId: string;
  actions: Array<any>;
};
