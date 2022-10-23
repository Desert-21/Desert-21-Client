import { Injectable } from '@angular/core';
import { ModifiableResource } from '../templates/modifiable-resource';

export type WinLooseDraw = 'WIN' | 'LOOSE' | 'DRAW' | 'NEUTRAL';

export type GameResult = {
  state: WinLooseDraw;
  bySurrender: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class GameResultService extends ModifiableResource<GameResult> {
  constructor() {
    super();
  }

  protected initialize(): GameResult {
    return {
      state: 'NEUTRAL',
      bySurrender: false,
    };
  }
}
