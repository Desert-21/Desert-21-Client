import {
  Army,
  BoardLocation,
  BuildingType,
  LabUpgrade,
  ResourceSet,
  TrainingMode,
  UnitType,
} from './game-models';

export type ActionHoverFieldSelectionType = 'SOURCE' | 'TARGET';

export type ActionHoverFieldSelection = {
  location: BoardLocation;
  type: ActionHoverFieldSelectionType;
};

export abstract class PlayersAction<ActionContent> {
  abstract getType(): ActionType;
  abstract getCost(): ResourceSet;
  abstract getRelatedLocations(): Array<ActionHoverFieldSelection>;

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
  | 'FIRE_ROCKET'
  | 'BOMBARD';

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

  getRelatedLocations(): ActionHoverFieldSelection[] {
    return [{ location: this.location, type: 'SOURCE' }];
  }

  protected toActionAPIRequestBody(): UpgradeActionContent {
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

  getRelatedLocations(): ActionHoverFieldSelection[] {
    return [{ location: this.location, type: 'SOURCE' }];
  }

  protected toActionAPIRequestBody(): TrainActionContent {
    return {
      location: this.location,
      unitType: this.unitType,
      trainingMode: this.trainingMode,
    };
  }
}

export class MoveUnitsAction extends PlayersAction<MoveUnitsActionContent> {
  from: BoardLocation;
  to: BoardLocation;
  path: Array<BoardLocation>;
  army: Army;

  constructor(path: Array<BoardLocation>, army: Army) {
    super();
    this.path = path;
    (this.from = this.path[0]),
      (this.to = this.path[this.path.length - 1]),
      (this.army = army);
  }

  getType(): ActionType {
    return 'MOVE_UNITS';
  }

  getCost(): ResourceSet {
    return { metal: 0, buildingMaterials: 0, electricity: 0 };
  }

  getRelatedLocations(): ActionHoverFieldSelection[] {
    return [
      { location: this.from, type: 'SOURCE' },
      { location: this.to, type: 'TARGET' },
    ];
  }

  protected toActionAPIRequestBody(): MoveUnitsActionContent {
    return {
      from: this.from,
      to: this.to,
      path: this.path,
      army: this.army,
    };
  }
}

export class AttackAction extends PlayersAction<AttackActionContent> {
  from: BoardLocation;
  to: BoardLocation;
  path: Array<BoardLocation>;
  army: Army;

  constructor(path: Array<BoardLocation>, army: Army) {
    super();
    this.path = path;
    (this.from = this.path[0]),
      (this.to = this.path[this.path.length - 1]),
      (this.army = army);
  }

  getType(): ActionType {
    return 'ATTACK';
  }

  getCost(): ResourceSet {
    return { metal: 0, buildingMaterials: 0, electricity: 0 };
  }

  getRelatedLocations(): ActionHoverFieldSelection[] {
    return [
      { location: this.from, type: 'SOURCE' },
      { location: this.to, type: 'TARGET' },
    ];
  }

  protected toActionAPIRequestBody(): AttackActionContent {
    return {
      from: this.from,
      to: this.to,
      path: this.path,
      army: this.army,
    };
  }
}

export class LabAction extends PlayersAction<LabActionContent> {
  upgrade: LabUpgrade;
  electricityCost: number;

  constructor(upgrade: LabUpgrade, electricityCost: number) {
    super();
    this.upgrade = upgrade;
    this.electricityCost = electricityCost;
  }

  getType(): ActionType {
    return 'LAB_EVENT';
  }

  getCost(): ResourceSet {
    return {
      metal: 0,
      buildingMaterials: 0,
      electricity: this.electricityCost,
    };
  }

  getRelatedLocations(): ActionHoverFieldSelection[] {
    return [];
  }

  protected toActionAPIRequestBody(): LabActionContent {
    return {
      upgrade: this.upgrade,
    };
  }
}

export class FireRocketAction extends PlayersAction<FireRocketActionContent> {
  target: BoardLocation;
  isTargetingRocket: boolean;
  electricityCost: number;

  constructor(
    target: BoardLocation,
    isTargetingRocket: boolean,
    electricityCost: number
  ) {
    super();
    this.target = target;
    this.isTargetingRocket = isTargetingRocket;
    this.electricityCost = electricityCost;
  }

  getType(): ActionType {
    return 'FIRE_ROCKET';
  }

  getCost(): ResourceSet {
    return {
      metal: 0,
      buildingMaterials: 0,
      electricity: this.electricityCost,
    };
  }

  getRelatedLocations(): ActionHoverFieldSelection[] {
    return [
      { location: this.target, type: 'TARGET' },
    ];
  }

  protected toActionAPIRequestBody(): FireRocketActionContent {
    return {
      target: this.target,
      isTargetingRocket: this.isTargetingRocket,
    };
  }
}

export class BuildBuildingAction extends PlayersAction<BuildBuildingActionContent> {
  location: BoardLocation;
  buildingType: BuildingType;
  buildingMaterialsCost: number;

  constructor(
    location: BoardLocation,
    buildingType: BuildingType,
    buildingMaterialsCost: number
  ) {
    super();
    this.location = location;
    this.buildingType = buildingType;
    this.buildingMaterialsCost = buildingMaterialsCost;
  }

  getType(): ActionType {
    return 'BUILD';
  }

  getCost(): ResourceSet {
    return {
      metal: 0,
      buildingMaterials: this.buildingMaterialsCost,
      electricity: 0,
    };
  }

  getRelatedLocations(): ActionHoverFieldSelection[] {
    return [
      { location: this.location, type: 'SOURCE' },
    ];
  }

  protected toActionAPIRequestBody(): BuildBuildingActionContent {
    return {
      location: this.location,
      buildingType: this.buildingType,
    };
  }
}

export class BombardAction extends PlayersAction<BombardActionContent> {
  from: BoardLocation;
  to: BoardLocation;
  path: Array<BoardLocation>;
  cannonsAmount: number;

  constructor(path: Array<BoardLocation>, cannonsAmount: number) {
    super();
    this.from = path[0];
    this.to = path[path.length - 1];
    this.path = path;
    this.cannonsAmount = cannonsAmount;
  }

  getType(): ActionType {
    return 'BOMBARD';
  }

  getCost(): ResourceSet {
    return { metal: 0, buildingMaterials: 0, electricity: 0 };
  }

  getRelatedLocations(): ActionHoverFieldSelection[] {
    return [
      { location: this.from, type: 'SOURCE' },
      { location: this.to, type: 'TARGET' },
    ];
  }

  protected toActionAPIRequestBody(): BombardActionContent {
    return {
      from: this.from,
      to: this.to,
      path: this.path,
      cannonsAmount: this.cannonsAmount,
    };
  }
}

export type BombardActionContent = {
  from: BoardLocation;
  to: BoardLocation;
  path: Array<BoardLocation>;
  cannonsAmount: number;
};

export type FireRocketActionContent = {
  target: BoardLocation;
  isTargetingRocket: boolean;
};

export type LabActionContent = {
  upgrade: LabUpgrade;
};

export type UpgradeActionContent = {
  location: BoardLocation;
};

export type TrainActionContent = {
  location: BoardLocation;
  unitType: UnitType;
  trainingMode: TrainingMode;
};

export type MoveUnitsActionContent = {
  from: BoardLocation;
  to: BoardLocation;
  path: Array<BoardLocation>;
  army: Army;
};

export type AttackActionContent = {
  from: BoardLocation;
  to: BoardLocation;
  path: Array<BoardLocation>;
  army: Army;
};

export type BuildBuildingActionContent = {
  location: BoardLocation;
  buildingType: BuildingType;
};
