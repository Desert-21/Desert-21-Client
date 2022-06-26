import { Injectable } from '@angular/core';
import { EstimatedArmy } from 'src/app/models/army-ranges';
import { Field, Player } from 'src/app/models/game-models';
import {
  FieldSelection,
  GameContext,
} from 'src/app/models/game-utility-models';
import {
  getHostileArmyEstimation,
  getFogOfWarCoefficient,
  ScarabsRange,
} from 'src/app/utils/army-utils';
import { getFogOfWarLevel } from 'src/app/utils/location-utils';
import { CurrentScarabsGenerationService } from '../../shared/current-scarabs-generation.service';
import {
  DoubleFieldSelection,
  DoubleFieldSelectionService,
} from '../double-field-selection.service';
import { GameContextService } from '../../shared/game-context.service';
import { ResourceProcessor } from '../../templates/resource-processor';

@Injectable({
  providedIn: 'root',
})
export class ToFieldDefendersService extends ResourceProcessor<EstimatedArmy | null> {
  constructor(
    private fieldSelectionService: DoubleFieldSelectionService,
    private gameContextService: GameContextService,
    private currentScarabsService: CurrentScarabsGenerationService
  ) {
    super([fieldSelectionService, gameContextService, currentScarabsService]);
  }

  protected processData(dataElements: any[]): EstimatedArmy | null {
    const [fieldSelection, context, scarabsRange] = dataElements as [
      DoubleFieldSelection,
      GameContext,
      ScarabsRange
    ];
    if (fieldSelection === null) {
      return null;
    }
    const field = fieldSelection.to;
    if (field.isOwned) {
      return null;
    }
    if (field.isEnemy) {
      return this.getEnemyEstimatedDefenders(
        field,
        context.opponent,
        context,
        scarabsRange
      );
    }
    return this.getUnocuppiedFieldEstimatedDefenders(scarabsRange);
  }

  private getEnemyEstimatedDefenders(
    field: FieldSelection,
    opponent: Player,
    context: GameContext,
    scarabsRange: ScarabsRange
  ): EstimatedArmy {
    const fogOfWarLevel = getFogOfWarLevel(
      { row: field.row, col: field.col },
      context.game.fields,
      opponent.id
    );
    return getHostileArmyEstimation(
      fogOfWarLevel,
      context.balance,
      field.field.army,
      opponent,
      scarabsRange
    );
  }

  private getUnocuppiedFieldEstimatedDefenders(
    scarabsRange: ScarabsRange
  ): EstimatedArmy {
    const averageCase = Math.round((scarabsRange.min + scarabsRange.max) / 2);
    return new EstimatedArmy(
      false,
      true,
      { droids: 0, tanks: 0, cannons: 0, scarabs: scarabsRange.min },
      { droids: 0, tanks: 0, cannons: 0, scarabs: averageCase },
      { droids: 0, tanks: 0, cannons: 0, scarabs: scarabsRange.max }
    );
  }
}
