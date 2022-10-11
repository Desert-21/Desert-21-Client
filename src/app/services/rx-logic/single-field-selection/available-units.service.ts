import { Injectable } from '@angular/core';
import { Army } from 'src/app/models/game-models';
import {
  FieldSelection,
  GameContext,
} from 'src/app/models/game-utility-models';
import { getFrozenUnitsAtLocation, subtractArmies } from 'src/app/utils/army-utils';
import { GameContextService } from '../shared/game-context.service';
import { ResourceProcessor } from '../templates/resource-processor';
import { SelectedFieldService } from './selected-field.service';

@Injectable({
  providedIn: 'root',
})
export class AvailableUnitsService extends ResourceProcessor<Army> {
  constructor(
    private gameContextService: GameContextService,
    private fieldSelectionService: SelectedFieldService
  ) {
    super([gameContextService, fieldSelectionService]);
  }

  protected processData(dataElements: any[]): Army {
    const [context, fieldSelection] = dataElements as [
      GameContext,
      FieldSelection
    ];
    if (fieldSelection === null) {
      return { droids: 0, tanks: 0, cannons: 0 };
    }
    const field = fieldSelection.field;
    const army =
      field.army !== null ? field.army : { droids: 0, tanks: 0, cannons: 0 };

    const frozenUnits = getFrozenUnitsAtLocation(
      fieldSelection,
      context.currentActions
    );
    return subtractArmies(army, frozenUnits);
  }
}
