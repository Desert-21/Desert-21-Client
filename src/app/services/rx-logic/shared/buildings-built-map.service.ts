import { Injectable } from '@angular/core';
import { BuildActionDetailsComponent } from 'src/app/components/game-view/left-panel/players-actions/action-entry/build-action-details/build-action-details.component';
import { BuildBuildingAction } from 'src/app/models/actions';
import { BuildBuildingEventContent } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import { ResourceProcessor } from '../templates/resource-processor';
import { GameContextService } from './game-context.service';

@Injectable({
  providedIn: 'root',
})
export class BuildingsBuiltMapService extends ResourceProcessor<
  Array<Array<boolean>>
> {
  constructor(private gameContextService: GameContextService) {
    super([gameContextService]);
  }

  protected processData(dataElements: any[]): boolean[][] {
    const [context] = dataElements as [GameContext];
    const fields = context.game.fields;
    const buildingActionsLocations = context.currentActions
      .filter((a) => a.getType() === 'BUILD')
      .map((a) => a as BuildBuildingAction)
      .map((a) => a.location);
    const buildingEventsLocations = context.game.events
      .filter((e) => e.type === 'BUILD')
      .map((e) => e.content as BuildBuildingEventContent)
      .map((c) => c.location);
    const allLocations = [...buildingActionsLocations, ... buildingEventsLocations];
    const rows = fields.length;
    const cols = fields[0].length;
    const buildingMap = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => false)
    );
    allLocations.forEach((e) => {
      buildingMap[e.row][e.col] = true;
    });
    return buildingMap;
  }
}
