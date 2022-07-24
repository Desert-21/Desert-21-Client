import { Injectable } from '@angular/core';
import { ModifiableResource } from '../../templates/modifiable-resource';

@Injectable({
  providedIn: 'root'
})
export class SimulatorLuckSelectorService extends ModifiableResource<number> {
  constructor() {
    super();
  }

  protected initialize(): number {
    return 50;
  }
}
