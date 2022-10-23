import { Injectable } from '@angular/core';
import { ModifiableResource } from '../templates/modifiable-resource';

@Injectable({
  providedIn: 'root'
})
export class IsDrawRequestedService extends ModifiableResource<boolean> {
  constructor() {
    super();
  }

  protected initialize(): boolean {
    return false;
  }
}
