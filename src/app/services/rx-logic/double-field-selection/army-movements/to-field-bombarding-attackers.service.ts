import { Injectable } from '@angular/core';
import { BombardAction } from 'src/app/models/actions';
import { BoardLocation } from 'src/app/models/game-models';
import {
  FieldSelection,
  GameContext,
} from 'src/app/models/game-utility-models';
import { areLocationsEqual } from 'src/app/utils/location-utils';
import { GameContextService } from '../../shared/game-context.service';
import { ResourceProcessor } from '../../templates/resource-processor';
import {
  DoubleFieldSelection,
  DoubleFieldSelectionService,
} from '../double-field-selection.service';

@Injectable({
  providedIn: 'root',
})
export class ToFieldBombardingAttackersService extends ResourceProcessor<number> {
  constructor(
    private fieldSelectionService: DoubleFieldSelectionService,
    private gameContextService: GameContextService
  ) {
    super([fieldSelectionService, gameContextService]);
  }

  protected processData(dataElements: any[]): number {
    const [fieldSelection, context] = dataElements as [
      DoubleFieldSelection,
      GameContext
    ];
    if (fieldSelection === null) {
      return 0;
    }
    const actions = context.currentActions;
    const location: BoardLocation = {
      row: fieldSelection.to.row,
      col: fieldSelection.to.col,
    };
    return actions
      .filter((a) => a.getType() === 'BOMBARD')
      .map((a) => a as BombardAction)
      .filter((a) => areLocationsEqual(a.to, location))
      .map((a) => a.cannonsAmount)
      .reduce((prev, next) => prev + next, 0);
  }
}
