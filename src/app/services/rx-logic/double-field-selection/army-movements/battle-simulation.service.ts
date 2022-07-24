import { Injectable } from '@angular/core';
import { FightingArmy } from 'src/app/models/army-ranges';
import { Army } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import { BattleResult } from 'src/app/models/notification-models';
import { performBattle } from 'src/app/utils/battles';
import { GameContextService } from '../../shared/game-context.service';
import { ResourceProcessor } from '../../templates/resource-processor';
import {
  DoubleFieldSelection,
  DoubleFieldSelectionService,
} from '../double-field-selection.service';
import { SimulatedDefendersService } from './simulated-defenders.service';
import { ToFieldTotalAttackersService } from './to-field-total-attackers.service';

const defaultBattleResult: BattleResult = {
  attackersBefore: { droids: 0, tanks: 0, cannons: 0, scarabs: 0 },
  defendersBefore: { droids: 0, tanks: 0, cannons: 0, scarabs: 0 },
  attackersAfter: { droids: 0, tanks: 0, cannons: 0, scarabs: 0 },
  defendersAfter: { droids: 0, tanks: 0, cannons: 0, scarabs: 0 },
  haveAttackersWon: false,
  wasUnoccupied: false,
};

@Injectable({
  providedIn: 'root',
})
export class BattleSimulationService extends ResourceProcessor<BattleResult> {
  constructor(
    private simulatedDefendersService: SimulatedDefendersService,
    private toFieldAttackers: ToFieldTotalAttackersService,
    private contextService: GameContextService,
    private fieldSelectionService: DoubleFieldSelectionService
  ) {
    super([
      simulatedDefendersService,
      toFieldAttackers,
      contextService,
      fieldSelectionService,
    ]);
  }

  protected processData(dataElements: any[]): BattleResult {
    const [defenders, attackers, context, fieldSelection] = dataElements as [
      FightingArmy,
      Army,
      GameContext,
      DoubleFieldSelection
    ];
    if (fieldSelection === null) {
      return defaultBattleResult;
    }
    return performBattle(
      attackers,
      defenders,
      context.player,
      context.opponent,
      context.balance,
      fieldSelection.to.field.building
    );
  }
}
