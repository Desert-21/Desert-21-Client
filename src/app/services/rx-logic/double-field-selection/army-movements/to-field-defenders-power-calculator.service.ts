import { Injectable } from '@angular/core';
import { EstimatedArmy } from 'src/app/models/army-ranges';
import { GameContext } from 'src/app/models/game-utility-models';
import { calculateDefendingFightingArmyPower } from 'src/app/utils/army-power-calculator';
import { GameContextService } from '../../shared/game-context.service';
import { ResourceProcessor } from '../../templates/resource-processor';
import {
  DoubleFieldSelection,
  DoubleFieldSelectionService,
} from '../double-field-selection.service';
import { ToFieldPostBombardingDefendersService } from './to-field-post-bombarding-defenders.service';
import { FightingArmy } from '../../../../models/army-ranges';

export class PowerRange {
  min: number;
  avg: number;
  max: number;

  constructor(min: number, avg: number, max: number) {
    this.min = min;
    this.avg = avg;
    this.max = max;
  }

  toStringDescription(): string {
    return this.min !== this.max
      ? `${this.min}-${this.max}`
      : this.avg.toString();
  }
}

@Injectable({
  providedIn: 'root',
})
export class ToFieldDefendersPowerCalculatorService extends ResourceProcessor<PowerRange> {
  constructor(
    private estimatedDefendersService: ToFieldPostBombardingDefendersService,
    private contextService: GameContextService,
    private fieldSelectionService: DoubleFieldSelectionService
  ) {
    super([estimatedDefendersService, contextService, fieldSelectionService]);
  }

  protected processData(dataElements: any[]): PowerRange {
    const [estimatedDefenders, context, fieldSelection] = dataElements as [
      EstimatedArmy,
      GameContext,
      DoubleFieldSelection
    ];
    if (fieldSelection === null) {
      return new PowerRange(0, 0, 0);
    }
    const { worstCase, averageCase, bestCase } = estimatedDefenders;
    const balance = context.balance;
    const defender = context.opponent;
    const attacker = context.player;
    const building = fieldSelection.to.field.building;
    const calculateByArmy = (army: FightingArmy): number => {
      return calculateDefendingFightingArmyPower(
        army,
        balance,
        defender,
        attacker,
        building
      );
    };
    const min = calculateByArmy(worstCase);
    const avg = calculateByArmy(averageCase);
    const max = calculateByArmy(bestCase);
    return new PowerRange(min, avg, max);
  }
}
