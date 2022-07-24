import { Injectable } from '@angular/core';
import { ResolutionPhaseNotification } from 'src/app/models/notification-models';
import { ModifiableResource } from '../templates/modifiable-resource';

@Injectable({
  providedIn: 'root',
})
export class ResolutionPhaseDataService extends ModifiableResource<ResolutionPhaseNotification> {
  protected initialize(): ResolutionPhaseNotification {
    return { timeout: new Date(), notifications: [] };
  }

  constructor() {
    super();
  }
}
