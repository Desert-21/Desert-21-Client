import { Injectable } from '@angular/core';
import { Army } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import { calculateAttackingArmyPower } from 'src/app/utils/army-power-calculator';
import { GameContextService } from '../../shared/game-context.service';
import { ResourceProcessor } from '../../templates/resource-processor';
import { ToFieldTotalAttackersService } from './to-field-total-attackers.service';

@Injectable({
  providedIn: 'root',
})
export class ToFieldAttackersPowerCalculatorService extends ResourceProcessor<number> {
  constructor(private totalAttackersService: ToFieldTotalAttackersService, private contextService: GameContextService) {
    super([totalAttackersService, contextService]);
  }

  protected processData(dataElements: any[]): number {
    const [army, context] = dataElements as [Army, GameContext];
    if (army === null) {
      return 0;
    }
    return calculateAttackingArmyPower(
      army,
      context.balance,
      context.player
    );
  }
}
