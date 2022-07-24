import { Injectable } from '@angular/core';
import { ResourceProcessor } from '../../templates/resource-processor';
import { ToFieldAttackersPowerCalculatorService } from './to-field-attackers-power-calculator.service';
import { PowerRange, ToFieldDefendersPowerCalculatorService } from './to-field-defenders-power-calculator.service';

@Injectable({
  providedIn: 'root',
})
export class WinningChanceCalculatorService extends ResourceProcessor<number> {
  constructor(
    private defendersPowerSevice: ToFieldDefendersPowerCalculatorService,
    private attackersPowerService: ToFieldAttackersPowerCalculatorService
  ) {
    super([defendersPowerSevice, attackersPowerService]);
  }

  protected processData(dataElements: any[]): number {
    const [defendersPowerRange, attackersPower] = dataElements as [PowerRange, number];
    const { min, max } = defendersPowerRange;
    if (attackersPower <= min) {
      return 0;
    }
    if (attackersPower > max) {
      return 1;
    }
    const rangeDifference = max - min;
    const minAndAttackersPowerDiff = attackersPower - min;
    return minAndAttackersPowerDiff / rangeDifference;
  }
}
