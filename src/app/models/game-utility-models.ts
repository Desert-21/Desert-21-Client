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
};

export type CurrentGameResponse = {
  gameId: string;
};
