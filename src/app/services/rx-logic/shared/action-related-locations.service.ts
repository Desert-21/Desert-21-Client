import { Injectable } from '@angular/core';
import { ActionHoverFieldSelection } from 'src/app/models/actions';
import { ModifiableResource } from '../templates/modifiable-resource';

@Injectable({
  providedIn: 'root',
})
export class ActionRelatedLocationsService extends ModifiableResource<
  Array<ActionHoverFieldSelection>
> {
  constructor() {
    super();
  }

  protected initialize(): ActionHoverFieldSelection[] {
    return [];
  }
}
