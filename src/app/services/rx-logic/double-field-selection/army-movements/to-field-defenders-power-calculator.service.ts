import { Injectable } from '@angular/core';
import { EstimatedArmy } from 'src/app/models/army-ranges';
import { GameContext } from 'src/app/models/game-utility-models';
import {
  calculateDefendingFightingArmyPower,
  calculateScarabsPower,
} from 'src/app/utils/army-power-calculator';
import { GameContextService } from '../../shared/game-context.service';
import { ResourceProcessor } from '../../templates/resource-processor';
import {
  DoubleFieldSelection,
  DoubleFieldSelectionService,
} from '../double-field-selection.service';
import { ToFieldPostBombardingDefendersService } from './to-field-post-bombarding-defenders.service';
import { FightingArmy } from '../../../../models/army-ranges';
import { getScarabsRange } from 'src/app/utils/army-utils';
import { ToFieldTotalAttackersService } from './to-field-total-attackers.service';
import { Army } from 'src/app/models/game-models';

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
    private fieldSelectionService: DoubleFieldSelectionService,
    private toFieldAttackersService: ToFieldTotalAttackersService
  ) {
    super([
      estimatedDefendersService,
      contextService,
      fieldSelectionService,
      toFieldAttackersService,
    ]);
  }

  protected processData(dataElements: any[]): PowerRange {
    const [estimatedDefenders, context, fieldSelection, attackerArmy] =
      dataElements as [EstimatedArmy, GameContext, DoubleFieldSelection, Army];
    if (fieldSelection === null) {
      return new PowerRange(0, 0, 0);
    }
    const { worstCase, averageCase, bestCase } = estimatedDefenders;
    const balance = context.balance;
    const defender = context.opponent;
    const attacker = context.player;
    const building = fieldSelection.to.field.building;
    if (!fieldSelection.to.isEnemy) {
      const range = getScarabsRange(
        context.game.stateManager.turnCounter,
        context.balance.combat.scarabs
      );
      const calculateByScarabs = (scarabs: number) => {
        return calculateScarabsPower(scarabs, context.balance, attacker);
      };
      return new PowerRange(
        calculateByScarabs(range.min),
        calculateByScarabs(range.avg),
        calculateByScarabs(range.max)
      );
    }

    const calculateByArmy = (army: FightingArmy): number => {
      return calculateDefendingFightingArmyPower(
        army,
        balance,
        defender,
        attacker,
        building,
        attackerArmy,
      );
    };
    const min = calculateByArmy(worstCase);
    const avg = calculateByArmy(averageCase);
    const max = calculateByArmy(bestCase);
    return new PowerRange(min, avg, max);
  }
}
