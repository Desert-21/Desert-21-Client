import { Injectable } from '@angular/core';
import { ModifiableResource } from '../templates/modifiable-resource';

@Injectable({
  providedIn: 'root'
})
export class HasWonBySurrenderService extends ModifiableResource<boolean | null> {
  protected initialize(): boolean {
    return false;
  }

  constructor() {
    super();
  }
}
