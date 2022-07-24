import { Injectable } from '@angular/core';
import { BombardAction } from 'src/app/models/actions';
import { EstimatedArmy } from 'src/app/models/army-ranges';
import { GameContext } from 'src/app/models/game-utility-models';
import { performBombardingOnEstimatedArmy } from 'src/app/utils/battles';
import { areLocationsEqual } from 'src/app/utils/location-utils';
import { GameContextService } from '../../shared/game-context.service';
import { ResourceProcessor } from '../../templates/resource-processor';
import {
  DoubleFieldSelection,
  DoubleFieldSelectionService,
} from '../double-field-selection.service';
import { ToFieldPostRocketsDefendersService } from './to-field-post-rockets-defenders.service';

const defaultEstimate: EstimatedArmy = new EstimatedArmy(
  'UNOCCUPIED',
  false,
  { droids: 0, tanks: 0, cannons: 0, scarabs: 0 },
  { droids: 0, tanks: 0, cannons: 0, scarabs: 0 },
  { droids: 0, tanks: 0, cannons: 0, scarabs: 0 }
);

@Injectable({
  providedIn: 'root',
})
export class ToFieldPostBombardingDefendersService extends ResourceProcessor<EstimatedArmy> {
  constructor(
    private postRocketDefendersService: ToFieldPostRocketsDefendersService,
    private gameContextService: GameContextService,
    private fieldSelectionService: DoubleFieldSelectionService
  ) {
    super([
      postRocketDefendersService,
      gameContextService,
      fieldSelectionService,
    ]);
  }

  protected processData(dataElements: any[]): EstimatedArmy {
    const [armyEstimateBefore, context, fieldSelection] = dataElements as [
      EstimatedArmy,
      GameContext,
      DoubleFieldSelection
    ];
    if (fieldSelection === null || armyEstimateBefore === null) {
      return defaultEstimate;
    }
    if (!fieldSelection.to.isOwned && !fieldSelection.to.isEnemy) {
      return armyEstimateBefore;
    }
    const totalCannonAttackers = context.currentActions
      .filter((a) => a.getType() === 'BOMBARD')
      .map((a) => a as BombardAction)
      .filter((a) => areLocationsEqual(a.to, fieldSelection.to))
      .map((a) => a.cannonsAmount)
      .reduce((prev, next) => prev + next, 0);
    return performBombardingOnEstimatedArmy(
      totalCannonAttackers,
      armyEstimateBefore,
      context.balance,
      context.player,
      context.opponent,
      fieldSelection.to.field.building
    );
  }
}
