import { Injectable } from '@angular/core';
import { LabUpgradeConfig } from 'src/app/models/lab';
import { ModifiableResource } from '../templates/modifiable-resource';

@Injectable({
  providedIn: 'root',
})
export class SelectedUpgradeService extends ModifiableResource<LabUpgradeConfig | null> {

  constructor() {
    super();
  }

  protected initialize(): LabUpgradeConfig {
    return null;
  }
}
