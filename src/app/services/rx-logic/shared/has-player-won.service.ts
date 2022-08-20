import { Injectable } from '@angular/core';
import { ModifiableResource } from '../templates/modifiable-resource';

@Injectable({
  providedIn: 'root'
})
export class HasPLayerWonService extends ModifiableResource<boolean | null> {
  protected initialize(): boolean {
    return null;
  }

  constructor() {
    super();
  }
}
