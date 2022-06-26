import { ArmyDescription } from '../components/game-view/right-panel/army-preview/army-preview-state';

export class EstimatedArmy {
  isEnemy: boolean;
  isRange: boolean;

  worstCase: FightingArmy;
  averageCase: FightingArmy;
  bestCase: FightingArmy;

  constructor(
    isEnemy: boolean,
    isRange: boolean,
    worstCase: FightingArmy,
    averageCase: FightingArmy,
    bestCase: FightingArmy
  ) {
    this.isEnemy = isEnemy;
    this.isRange = isRange;
    this.worstCase = worstCase;
    this.averageCase = averageCase;
    this.bestCase = bestCase;
  }

  toStringDescription(): ArmyDescription {
    const droids =
      this.isRange && this.worstCase.droids !== this.bestCase.droids
        ? `${this.worstCase.droids}-${this.bestCase.droids}`
        : this.averageCase.droids.toString();
    const tanks =
      this.isRange && this.worstCase.tanks !== this.bestCase.tanks
        ? `${this.worstCase.tanks}-${this.bestCase.tanks}`
        : this.averageCase.tanks.toString();
    const cannons =
      this.isRange && this.worstCase.cannons !== this.bestCase.cannons
        ? `${this.worstCase.cannons}-${this.bestCase.cannons}`
        : this.averageCase.cannons.toString();
    const scarabs =
      this.isRange && this.worstCase.scarabs !== this.bestCase.scarabs
        ? `${this.worstCase.scarabs}-${this.bestCase.scarabs}`
        : this.averageCase.scarabs.toString();
    return {
      droids,
      tanks,
      cannons,
      scarabs,
    };
  }
}

export type FightingArmy = {
  droids: number;
  tanks: number;
  cannons: number;
  scarabs: number;
};
