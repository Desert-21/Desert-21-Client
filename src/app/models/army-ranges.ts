import { ArmyDescription } from '../components/game-view/right-panel/army-preview/army-preview-state';
import { OwnershipType } from './game-utility-models';

export class EstimatedArmy {
  ownership: OwnershipType;
  isRange: boolean;

  worstCase: FightingArmy;
  averageCase: FightingArmy;
  bestCase: FightingArmy;

  constructor(
    ownership: OwnershipType,
    isRange: boolean,
    worstCase: FightingArmy,
    averageCase: FightingArmy,
    bestCase: FightingArmy
  ) {
    this.ownership = ownership;
    this.isRange = isRange;
    this.worstCase = worstCase;
    this.averageCase = averageCase;
    this.bestCase = bestCase;
  }

  mapArmy(mapFunction: (army: FightingArmy) => FightingArmy): EstimatedArmy {
    const worstCase = mapFunction(this.worstCase);
    const averageCase = mapFunction(this.averageCase);
    const bestCase = mapFunction(this.bestCase);
    return new EstimatedArmy(
      this.ownership,
      this.isRange,
      worstCase,
      averageCase,
      bestCase
    );
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
