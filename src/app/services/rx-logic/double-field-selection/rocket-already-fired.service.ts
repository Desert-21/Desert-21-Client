import { Injectable } from '@angular/core';
import { PlayersAction } from 'src/app/models/actions';
import { CurrentActionsService } from '../shared/current-actions.service';
import { ResourceProcessor } from '../templates/resource-processor';

@Injectable({
  providedIn: 'root',
})
export class RocketAlreadyFiredService extends ResourceProcessor<boolean> {
  constructor(private currentActionsService: CurrentActionsService) {
    super([currentActionsService]);
  }

  protected processData(dataElements: any[]): boolean {
    const [actions] = dataElements as [Array<PlayersAction<any>>];
    return actions.some(a => a.getType() === 'FIRE_ROCKET');
  }
}
