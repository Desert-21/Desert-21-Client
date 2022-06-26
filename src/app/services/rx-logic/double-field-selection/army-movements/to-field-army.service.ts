import { Injectable } from '@angular/core';
import { Army, BoardLocation } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import { getNextTurnMovedUnitsAtLocation, sumArmies } from 'src/app/utils/army-utils';
import { findByFieldLocation } from 'src/app/utils/location-utils';
import {
  DoubleFieldSelection,
  DoubleFieldSelectionService,
} from '../double-field-selection.service';
import { GameContextService } from '../../shared/game-context.service';
import { LastShortestPathCalculationService } from '../drag-and-drop/last-shortest-path-calculation.service';
import { ResourceProcessor } from '../../templates/resource-processor';

@Injectable({
  providedIn: 'root',
})
export class ToFieldArmyService extends ResourceProcessor<Army> {
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
    const field = fieldSelection.to.field;
    const army =
      field.army !== null ? field.army : { droids: 0, tanks: 0, cannons: 0 };

    const nextTurnUnitsDiff = getNextTurnMovedUnitsAtLocation(
      fieldSelection.to,
      context.currentActions
    );
    return sumArmies(army, nextTurnUnitsDiff);
  }
}
