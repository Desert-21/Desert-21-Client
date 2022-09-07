import { Injectable } from '@angular/core';
import { emit } from 'process';
import { BuildBuildingAction } from 'src/app/models/actions';
import {
  BuildBuildingEventContent,
  BuildingType,
} from 'src/app/models/game-models';
import {
  FieldSelection,
  GameContext,
} from 'src/app/models/game-utility-models';
import { areLocationsEqual } from 'src/app/utils/location-utils';
import { GameContextService } from '../shared/game-context.service';
import { ResourceProcessor } from '../templates/resource-processor';
import { SelectedFieldService } from './selected-field.service';

@Injectable({
  providedIn: 'root',
})
export class CurrentlyBuiltBuildingService extends ResourceProcessor<BuildingType | null> {
  constructor(
    private gameContextService: GameContextService,
    private fieldSelectionService: SelectedFieldService
  ) {
    super([gameContextService, fieldSelectionService]);
  }

  protected processData(dataElements: any[]): BuildingType | null {
    const [context, fieldSelection] = dataElements as [
      GameContext,
      FieldSelection
    ];
    const fromEvent = context.game.events
      .filter((e) => e.type === 'BUILD')
      .map((e) => e.content as BuildBuildingEventContent)
      .find((e) => areLocationsEqual(e.location, fieldSelection));
    const fromAction = context.currentActions
      .filter((a) => a.getType() === 'BUILD')
      .map((a) => a as BuildBuildingAction)
      .find((a) => areLocationsEqual(a.location, fieldSelection));
    return fromEvent?.buildingType || fromAction?.buildingType || null;
  }
}
