import { Injectable } from '@angular/core';
import { BoardLocation, Game } from 'src/app/models/game-models';
import { generateEmptyTable } from 'src/app/utils/location-utils';
import { GameStateService } from '../http/game-state.service';
import { DragAndDropIsOnService } from './drag-and-drop-is-on.service';
import { LastShortestPathCalculationService } from './last-shortest-path-calculation.service';
import { ResourceProcessor } from './resource-processor';
import { ShortestPathCalculatorService } from './shortest-path-calculator.service';

export type FieldLinking = {
  vertical: Array<Array<boolean>>;
  horizontal: Array<Array<boolean>>;
};

@Injectable({
  providedIn: 'root',
})
export class FieldLinkingService extends ResourceProcessor<FieldLinking> {
  constructor(
    private gameStateService: GameStateService,
    private lastShortestPathCalculator: LastShortestPathCalculationService,
    private isOnService: DragAndDropIsOnService
  ) {
    super([gameStateService, lastShortestPathCalculator, isOnService]);
  }

  protected processData(dataElements: any[]): FieldLinking {
    const [game, path, isOn] = dataElements as [
      Game,
      Array<BoardLocation>,
      boolean
    ];

    const rows = game.fields.length;
    const cols = game.fields[0].length;
    const vertical = generateEmptyTable(rows, cols);
    const horizontal = generateEmptyTable(rows, cols);
    if (!isOn) {
      return { vertical, horizontal };
    }
    const horizontalLinkageLocations =
      this.locationsToHorizontalLinkageLocations(path);
    const verticalLinkageLocations =
      this.locationsToVerticalLinkageLocations(path);
    horizontalLinkageLocations.forEach(
      (loc) => (horizontal[loc.row][loc.col] = true)
    );
    verticalLinkageLocations.forEach(
      (loc) => (vertical[loc.row][loc.col] = true)
    );
    return {
      horizontal,
      vertical,
    };
  }

  private locationsToHorizontalLinkageLocations(
    locations: Array<BoardLocation>
  ): Array<BoardLocation> {
    if (locations.length < 2) {
      return [];
    }
    const acc = [];

    let index = 0;
    while (index !== locations.length - 1) {
      const first = locations[index];
      const second = locations[index + 1];
      if (first.row === second.row) {
        const horizontalIndex = first.col < second.col ? first : second;
        acc.push(horizontalIndex);
      }
      index++;
    }
    return acc;
  }

  private locationsToVerticalLinkageLocations(
    locations: Array<BoardLocation>
  ): Array<BoardLocation> {
    if (locations.length < 2) {
      return [];
    }
    const acc = [];

    let index = 0;
    while (index !== locations.length - 1) {
      const first = locations[index];
      const second = locations[index + 1];
      if (first.col === second.col) {
        const horizontalIndex = first.row < second.row ? first : second;
        acc.push(horizontalIndex);
      }
      index++;
    }
    return acc;
  }
}
