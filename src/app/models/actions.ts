import {
  BoardLocation,
  ResourceSet,
  TrainingMode,
  UnitType,
} from './game-models';

export abstract class PlayersAction<ActionContent> {
  abstract getType(): ActionType;
  abstract getCost(): ResourceSet;

  protected abstract toActionAPIRequestBody(): ActionContent;

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

  getType(): ActionType {
    return 'UPGRADE';
  }

  protected toActionAPIRequestBody(): any {
    return {
      location: this.location,
    };
  }
}

export class TrainAction extends PlayersAction<TrainActionContent> {
  location: BoardLocation;
  metalCost: number;
  unitType: UnitType;
  trainingMode: TrainingMode;
  amount: number;

  constructor(
    location: BoardLocation,
    metalCost: number,
    unitType: UnitType,
    trainingMode: TrainingMode,
    amount: number
  ) {
    super();
    this.location = location;
    this.metalCost = metalCost;
    this.unitType = unitType;
    this.trainingMode = trainingMode;
    this.amount = amount;
  }

  getType(): ActionType {
    return 'TRAIN';
  }

  getCost(): ResourceSet {
    return { metal: this.metalCost, buildingMaterials: 0, electricity: 0 };
  }

  protected toActionAPIRequestBody(): TrainActionContent {
    return {
      location: this.location,
      unitType: this.unitType,
      trainingMode: this.trainingMode,
    };
  }
}

export type UpgradeActionContent = {
  location: BoardLocation;
};

export type TrainActionContent = {
  location: BoardLocation;
  unitType: UnitType;
  trainingMode: TrainingMode;
};
