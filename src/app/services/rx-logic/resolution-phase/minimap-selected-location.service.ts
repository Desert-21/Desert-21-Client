import { Injectable } from '@angular/core';
import { BoardLocation } from 'src/app/models/game-models';
import { ModifiableResource } from '../templates/modifiable-resource';

@Injectable({
  providedIn: 'root',
})
export class MinimapSelectedLocationService extends ModifiableResource<BoardLocation> {
  constructor() {
    super();
  }

  protected initialize(): BoardLocation {
    return { row: 0, col: 0 };
  }
}
