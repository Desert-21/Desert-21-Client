import { Injectable } from '@angular/core';
import { ModifiableResource } from '../templates/modifiable-resource';

export type AcceptModalAction = {
  text: string;
  onAccept: () => void;
  onReject: () => void;
};

@Injectable({
  providedIn: 'root',
})
export class AcceptModalActionService extends ModifiableResource<AcceptModalAction> {
  constructor() {
    super();
  }

  protected initialize(): AcceptModalAction {
    return {
      text: '',
      onAccept: () => {},
      onReject: () => {},
    };
  }
}
