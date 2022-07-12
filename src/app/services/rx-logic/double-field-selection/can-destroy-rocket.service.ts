import { Injectable } from '@angular/core';
import { GameContext } from 'src/app/models/game-utility-models';
import { GameContextService } from '../shared/game-context.service';
import { ResourceProcessor } from '../templates/resource-processor';
import {
  DoubleFieldSelection,
  DoubleFieldSelectionService,
} from './double-field-selection.service';

@Injectable({
  providedIn: 'root',
})
export class CanDestroyRocketService extends ResourceProcessor<boolean> {
  constructor(
    private fieldSelectionService: DoubleFieldSelectionService,
    private gameContextServ8ice: GameContextService
  ) {
    super([fieldSelectionService, gameContextServ8ice]);
  }

  protected processData(dataElements: any[]): boolean {
    const [fieldSelection, context] = dataElements as [
      DoubleFieldSelection,
      GameContext
    ];
    if (fieldSelection === null || fieldSelection.to === null) {
      return false;
    }
    if (!context.player.upgrades.includes('SUPER_SONIC_ROCKETS')) {
      return false;
    }
    const building = fieldSelection.to.field.building;
    return building.type === 'ROCKET_LAUNCHER';
  }
}
