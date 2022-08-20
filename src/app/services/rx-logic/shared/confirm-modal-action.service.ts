import { Injectable } from '@angular/core';
import { ModifiableResource } from '../templates/modifiable-resource';

export type ConfirmModalAction = {
  text: string;
  action: () => void;
};

@Injectable({
  providedIn: 'root',
})
export class ConfirmModalActionService extends ModifiableResource<ConfirmModalAction> {
  protected initialize(): ConfirmModalAction {
    return {
      text: '',
      action: () => {},
    };
  }
  constructor() {
    super();
  }
}
