import { Injectable } from '@angular/core';
import { Army } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import { getFrozenUnitsAtLocation, subtractArmies } from 'src/app/utils/army-utils';
import {
  DoubleFieldSelection,
  DoubleFieldSelectionService,
} from '../double-field-selection.service';
import { GameContextService } from '../../shared/game-context.service';
import { ResourceProcessor } from '../../templates/resource-processor';

@Injectable({
  providedIn: 'root',
})
export class FromFieldArmyService extends ResourceProcessor<Army> {
  constructor(
    private fieldSelectionService: DoubleFieldSelectionService,
    private gameContextService: GameContextService
  ) {
    super([fieldSelectionService, gameContextService]);
  }

  protected processData(dataElements: any[]): Army {
    const [fieldSelection, context] = dataElements as [
      DoubleFieldSelection,
      GameContext
    ];
    if (fieldSelection === null) {
      return { droids: 0, tanks: 0, cannons: 0 };
    }
    const field = fieldSelection.from.field;
    const army =
      field.army !== null ? field.army : { droids: 0, tanks: 0, cannons: 0 };

    const from = fieldSelection.from;
    const frozenUnits = getFrozenUnitsAtLocation({ row: from.row, col: from.col }, context.currentActions);
    return subtractArmies(army, frozenUnits);
  }
}
