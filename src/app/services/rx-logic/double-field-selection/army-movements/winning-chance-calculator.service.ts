import { Injectable } from '@angular/core';
import { EstimatedArmy } from 'src/app/models/army-ranges';
import { ResourceProcessor } from '../../templates/resource-processor';
import { ToFieldAttackersPowerCalculatorService } from './to-field-attackers-power-calculator.service';
import {
  PowerRange,
  ToFieldDefendersPowerCalculatorService,
} from './to-field-defenders-power-calculator.service';
import { ToFieldDefendersService } from './to-field-defenders.service';

@Injectable({
  providedIn: 'root',
})
export class WinningChanceCalculatorService extends ResourceProcessor<number> {
  constructor(
    private defendersPowerSevice: ToFieldDefendersPowerCalculatorService,
    private attackersPowerService: ToFieldAttackersPowerCalculatorService,
    private defendersArmyService: ToFieldDefendersService
  ) {
    super([defendersPowerSevice, attackersPowerService, defendersArmyService]);
  }

  protected processData(dataElements: any[]): number {
    const [defendersPowerRange, attackersPower, armyEstimate] =
      dataElements as [PowerRange, number, EstimatedArmy];
    const { min, max } = defendersPowerRange;
    if (attackersPower <= min) {
      return 0;
    }
    if (attackersPower > max) {
      return 1;
    }
    const rangeDifference = max - min;
    const actualArtificialRangeDifference = rangeDifference + this.calculateRightHandSideArmyBias(
      rangeDifference,
      armyEstimate
    );
    const minAndAttackersPowerDiff = attackersPower - min;
    return minAndAttackersPowerDiff / actualArtificialRangeDifference;
  }

  private calculateRightHandSideArmyBias(
    rangeDifference: number,
    armyEstimate: EstimatedArmy
  ): number {
    const droidsDiff =
      armyEstimate.bestCase.droids - armyEstimate.worstCase.droids;
    const tanksDiff =
      armyEstimate.bestCase.tanks - armyEstimate.worstCase.tanks;
    const cannonsDiff =
      armyEstimate.bestCase.cannons - armyEstimate.worstCase.cannons;
    const scarabsDiff =
      armyEstimate.bestCase.scarabs - armyEstimate.worstCase.scarabs;
    return (
      rangeDifference / (droidsDiff + tanksDiff + cannonsDiff + scarabsDiff)
    );
  }
}
