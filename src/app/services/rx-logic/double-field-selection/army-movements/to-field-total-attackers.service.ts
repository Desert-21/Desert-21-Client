import { Injectable } from '@angular/core';
import { Army } from 'src/app/models/game-models';
import { sumArmies } from 'src/app/utils/army-utils';
import { ResourceProcessor } from '../../templates/resource-processor';
import { ToFieldFromCurrentFieldAttackersService } from './to-field-from-current-field-attackers.service';
import { ToFieldFromOtherFieldsAttackersService } from './to-field-from-other-fields-attackers.service';

@Injectable({
  providedIn: 'root',
})
export class ToFieldTotalAttackersService extends ResourceProcessor<Army> {
  constructor(
    private fromOtherService: ToFieldFromOtherFieldsAttackersService,
    private fromCurrentService: ToFieldFromCurrentFieldAttackersService
  ) {
    super([fromOtherService, fromCurrentService]);
  }

  protected processData(dataElements: any[]): Army {
    const [otherFieldsArmy, currentFieldArmy] = dataElements as [Army, Army];
    return sumArmies(otherFieldsArmy, currentFieldArmy);
  }
}
