import { Injectable } from '@angular/core';
import { Army } from 'src/app/models/game-models';
import { ModifiableResource } from '../../templates/modifiable-resource';

@Injectable({
  providedIn: 'root',
})
export class ToFieldFromCurrentFieldAttackersService extends ModifiableResource<Army> {
  constructor() {
    super();
  }

  protected initialize(): Army {
    return { droids: 0, tanks: 0, cannons: 0 };
  }
}
