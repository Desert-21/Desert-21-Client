import { ArmyDescription } from '../components/game-view/right-panel/army-preview/army-preview-state';

export class EstimatedArmy {
  isRange: boolean;

  worstCase: FightingArmy;
  averageCase: FightingArmy;
  bestCase: FightingArmy;

  constructor(
    isRange: boolean,
    worstCase: FightingArmy,
    averageCase: FightingArmy,
    bestCase: FightingArmy
  ) {
    this.isRange = isRange;
    this.worstCase = worstCase;
    this.averageCase = averageCase;
    this.bestCase = bestCase;
  }

  toStringDescription(): ArmyDescription {
    if (this.isRange) {
      return {
        droids: `${this.worstCase.droids}-${this.bestCase.droids}`,
        tanks: `${this.worstCase.tanks}-${this.bestCase.tanks}`,
        cannons: `${this.worstCase.cannons}-${this.bestCase.cannons}`,
        scarabs: `${this.worstCase.scarabs}-${this.bestCase.scarabs}`,
      };
    }
    return {
      droids: this.averageCase.droids.toString(),
      tanks: this.averageCase.tanks.toString(),
      cannons: this.averageCase.cannons.toString(),
      scarabs: this.averageCase.scarabs?.toString(),
    };
  }
}

export type FightingArmy = {
  droids: number;
  tanks: number;
  cannons: number;
  scarabs: number;
};
