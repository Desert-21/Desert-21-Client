import { Injectable } from '@angular/core';
import { LabUpgrade } from 'src/app/models/game-models';
import { LabUpgradeConfig } from 'src/app/models/lab';
import { ModifiableResource } from '../templates/modifiable-resource';

@Injectable({
  providedIn: 'root',
})
export class SelectedUpgradeService extends ModifiableResource<LabUpgrade | null> {

  constructor() {
    super();
  }

  protected initialize(): LabUpgrade | null {
    return null;
  }
}
