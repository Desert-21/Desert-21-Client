import { Injectable } from '@angular/core';
import { GameContext } from 'src/app/models/game-utility-models';
import {
  ExplainedAvailability,
  getAvailable,
  getNotAvailable,
} from 'src/app/utils/validation';
import { GameContextService } from '../shared/game-context.service';
import { ResourceProcessor } from '../templates/resource-processor';
import {
  DoubleFieldSelection,
  DoubleFieldSelectionService,
} from './double-field-selection.service';

@Injectable({
  providedIn: 'root',
})
export class CanDestroyRocketService extends ResourceProcessor<ExplainedAvailability> {
  constructor(
    private fieldSelectionService: DoubleFieldSelectionService,
    private gameContextServ8ice: GameContextService
  ) {
    super([fieldSelectionService, gameContextServ8ice]);
  }

  protected processData(dataElements: any[]): ExplainedAvailability {
    const [fieldSelection, context] = dataElements as [
      DoubleFieldSelection,
      GameContext
    ];
    if (fieldSelection === null || fieldSelection.to === null) {
      return getNotAvailable('');
    }
    if (!context.player.upgrades.includes('SUPER_SONIC_ROCKETS')) {
      return getNotAvailable(
        'Upgrade "Super Sonic Rockets" to unlock this feature.'
      );
    }
    const building = fieldSelection.to.field.building;
    if (building.type !== 'ROCKET_LAUNCHER') {
      return getNotAvailable(
        'Only rocket launcher can be destroyed by another rocket launcher.'
      );
    }
    return getAvailable();
  }
}
