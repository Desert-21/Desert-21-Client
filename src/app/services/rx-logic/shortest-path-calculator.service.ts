import { Injectable } from '@angular/core';
import { BoardLocation } from 'src/app/models/game-models';
import {
  DirectedLocationPair,
  GameContext,
} from 'src/app/models/game-utility-models';
import { getFastestUnitsSpeed } from 'src/app/utils/army-utils';
import {
  findByFieldLocation,
  getGeometricDistanceBetween,
} from 'src/app/utils/location-utils';
import { DragAndDropFieldsSelectionService } from './drag-and-drop-fields-selection.service';
import { GameContextService } from './game-context.service';
import { ResourceProcessor } from './resource-processor';
import {
  attackStrategy,
  FindShortestPathStartegy,
  moveUnitsStrategy,
  rocketStrikeStrategy,
} from './shortest-path-startegies';

@Injectable({
  providedIn: 'root',
})
export class ShortestPathCalculatorService extends ResourceProcessor<Array<BoardLocation> | null> {
  constructor(
    private dragAndDropService: DragAndDropFieldsSelectionService,
    private gameContextService: GameContextService
  ) {
    super([dragAndDropService, gameContextService]);
    this.gameContextService.requestState();
  }

  private previous: Array<BoardLocation> = [];

  protected processData(dataElements: any[]): BoardLocation[] | null {
    const [selectedLocations, context] = dataElements as [
      DirectedLocationPair,
      GameContext
    ];
    if (selectedLocations === null || selectedLocations.from === null || selectedLocations.to === null) {
      return this.previous;
    }
    const strategies = this.chooseStrategiesForShortestPath(
      selectedLocations,
      context
    );
    if (strategies === null) {
      return this.previous;
    }
    const newPath = strategies.reduce((prev, next) => {
      return prev === null
        ? next.findShortestPath(selectedLocations, context)
        : prev;
    }, null) as Array<BoardLocation> | null;
    this.previous = newPath;
    return newPath;
  }

  // these strategies will be executed in order
  private chooseStrategiesForShortestPath(
    selectedLocations: DirectedLocationPair,
    context: GameContext
  ): Array<FindShortestPathStartegy> | null {
    const fromLoc = selectedLocations.from;
    const toLoc = selectedLocations.to;
    const fields = context.game.fields;
    const fromField = findByFieldLocation(fromLoc.row, fromLoc.col, fields);
    const toField = findByFieldLocation(toLoc.row, toLoc.col, fields);
    if (fromField === null || toField === null || fromField === toField) {
      return null;
    }

    const playerId = context.player.id;
    const enemyId = context.opponent.id;
    const fastestUnitSpeed = getFastestUnitsSpeed(
      fromField.army,
      context.balance.combat
    );
    const geometricDistance = getGeometricDistanceBetween(fromLoc, toLoc);
    const isPossibleToReach = fastestUnitSpeed >= geometricDistance;
    const ownsFromField = fromField.ownerId === playerId;
    const isToFieldHostile =
      toField.ownerId === null || toField.ownerId === enemyId;

    const canFireRockets =
      ownsFromField && fromField.building.type === 'ROCKET_LAUNCHER';
    const optionalFireRockets = canFireRockets ? rocketStrikeStrategy : null;

    if (ownsFromField && toField.ownerId === playerId && isPossibleToReach) {
      return [moveUnitsStrategy, optionalFireRockets].filter((s) => s !== null);
    }
    if (ownsFromField && isToFieldHostile && isPossibleToReach) {
      return [attackStrategy, optionalFireRockets].filter((s) => s !== null);
    }
    if (canFireRockets) {
      return [optionalFireRockets];
    }
    return null;
  }
}
