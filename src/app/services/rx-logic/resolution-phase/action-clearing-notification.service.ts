import { Injectable } from '@angular/core';
import { ModifiableResource } from '../templates/modifiable-resource';

type Signal = 1;

@Injectable({
  providedIn: 'root',
})
export class ActionClearingNotificationService extends ModifiableResource<Signal> {
  protected initialize(): 1 {
    return 1;
  }

  constructor() {
    super();
  }
}
