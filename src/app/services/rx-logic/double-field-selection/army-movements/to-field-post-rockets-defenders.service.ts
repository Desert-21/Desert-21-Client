import { Injectable } from '@angular/core';
import { FireRocketAction } from 'src/app/models/actions';
import { EstimatedArmy } from 'src/app/models/army-ranges';
import { BoardLocation } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import {
  damageArmyByRocket,
  performBombardingOnEstimatedArmy,
} from 'src/app/utils/battles';
import { areLocationsEqual } from 'src/app/utils/location-utils';
import { GameContextService } from '../../shared/game-context.service';
import { ResourceProcessor } from '../../templates/resource-processor';
import {
  DoubleFieldSelection,
  DoubleFieldSelectionService,
} from '../double-field-selection.service';
import { ToFieldDefendersService } from './to-field-defenders.service';

@Injectable({
  providedIn: 'root',
})
export class ToFieldPostRocketsDefendersService extends ResourceProcessor<EstimatedArmy> {
  constructor(
    private toFieldDefendersService: ToFieldDefendersService,
    private gameContextService: GameContextService,
    private fieldSelectionService: DoubleFieldSelectionService
  ) {
    super([toFieldDefendersService, gameContextService, fieldSelectionService]);
  }

  protected processData(dataElements: any[]): EstimatedArmy {
    const [defendersBefore, context, fieldSelection] = dataElements as [
      EstimatedArmy,
      GameContext,
      DoubleFieldSelection
    ];
    if (fieldSelection === null || defendersBefore === null) {
      return null;
    }
    const location: BoardLocation = {
      row: fieldSelection.to.row,
      col: fieldSelection.to.col,
    };
    const isFieldCurrentlyTargetedByRocket = context.currentActions
      .filter((a) => a.getType() === 'FIRE_ROCKET')
      .map((a) => a as FireRocketAction)
      .some((a) => areLocationsEqual(a.target, location));
    if (isFieldCurrentlyTargetedByRocket) {
      return damageArmyByRocket(defendersBefore, context.balance);
    }
    return defendersBefore;
  }
}
