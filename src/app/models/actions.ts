import { BoardLocation, ResourceSet } from './game-models';

export abstract class PlayersAction<ActionContent> {
  abstract getType(): ActionType;
  abstract getContent(): ActionContent;
  abstract getCost(): ResourceSet;

  protected abstract toActionAPIRequestBody(): any;

  toActionAPIBody(): any {
    return {
      type: this.getType(),
      content: this.toActionAPIRequestBody(),
    };
  }
}

export type ActionType =
  | 'LAB_EVENT'
  | 'BUILD'
  | 'UPGRADE'
  | 'TRAIN'
  | 'MOVE_UNITS'
  | 'ATTACK'
  | 'FIRE_ROCKET';

export class UpgradeAction extends PlayersAction<UpgradeActionContent> {
  buildingMaterialsCost: number;
  location: BoardLocation;

  constructor(cost: number, location: BoardLocation) {
    super();
    this.buildingMaterialsCost = cost;
    this.location = location;
  }

  getCost(): ResourceSet {
    return {
      metal: 0,
      buildingMaterials: this.buildingMaterialsCost,
      electricity: 0,
    };
  }

  getContent(): UpgradeActionContent {
    return {
      location: this.location,
    };
  }

  getType(): ActionType {
    return 'UPGRADE';
  }

  protected toActionAPIRequestBody(): any {
    return {
      location: this.location,
    };
  }
}

export type UpgradeActionContent = {
  location: BoardLocation;
};
