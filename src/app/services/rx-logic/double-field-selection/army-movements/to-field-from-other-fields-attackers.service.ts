import { Injectable } from '@angular/core';
import { Army, BoardLocation } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import { getNextTurnAttackingUnitsAtLocation } from 'src/app/utils/army-utils';
import {
  DoubleFieldSelection,
  DoubleFieldSelectionService,
} from '../double-field-selection.service';
import { GameContextService } from '../../shared/game-context.service';
import { ResourceProcessor } from '../../templates/resource-processor';

@Injectable({
  providedIn: 'root',
})
export class ToFieldFromOtherFieldsAttackersService extends ResourceProcessor<Army> {
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
    const toField = fieldSelection.to;
    const location: BoardLocation = { row: toField.row, col: toField.col };
    return getNextTurnAttackingUnitsAtLocation(location, context.currentActions);
  }
}
