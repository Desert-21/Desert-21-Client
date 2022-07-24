import { Injectable } from '@angular/core';
import { EstimatedArmy, FightingArmy } from 'src/app/models/army-ranges';
import { ResourceProcessor } from '../../templates/resource-processor';
import { SimulatorLuckSelectorService } from './simulator-luck-selector.service';
import { ToFieldPostBombardingDefendersService } from './to-field-post-bombarding-defenders.service';

@Injectable({
  providedIn: 'root',
})
export class SimulatedDefendersService extends ResourceProcessor<FightingArmy> {
  constructor(
    private luckSelector: SimulatorLuckSelectorService,
    private defendersService: ToFieldPostBombardingDefendersService
  ) {
    super([luckSelector, defendersService]);
  }

  protected processData(dataElements: any[]): FightingArmy {
    const [luck, { worstCase, bestCase }] = dataElements as [
      number,
      EstimatedArmy
    ];
    const ratio = luck / 100;
    const droids = this.findPointInRangeByRatio(worstCase.droids, bestCase.droids, ratio);
    const tanks = this.findPointInRangeByRatio(worstCase.tanks, bestCase.tanks, ratio);
    const cannons = this.findPointInRangeByRatio(worstCase.cannons, bestCase.cannons, ratio);
    const scarabs = this.findPointInRangeByRatio(worstCase.scarabs, bestCase.scarabs, ratio);
    return { droids, tanks, cannons, scarabs };
  }

  private findPointInRangeByRatio(min: number, max: number, ratio: number): number {
    const minMaxDiff = max - min;
    const distanceFromMin = ratio * minMaxDiff;
    return Math.round(min + distanceFromMin);
  }
}
