export type Game = {
  gameId: string;
  players: Array<Player>;
  fields: Array<Array<Field>>;
  stateManager: StateManager;
  events: Array<GameEvent>;
};

export type Field = {
  building: Building;
  ownerId: string;
  army: Army;
};

export type Army = {
  droids: number;
  tanks: number;
  cannons: number;
};

export type UnitType = 'DROID' | 'TANK' | 'CANNON';
export type TrainingMode =
  | 'SMALL_PRODUCTION'
  | 'MEDIUM_PRODUCTION'
  | 'MASS_PRODUCTION';

export type Building = {
  type: BuildingType;
  level: number;
};

export type BuildingType =
  | 'METAL_FACTORY'
  | 'BUILDING_MATERIALS_FACTORY'
  | 'ELECTRICITY_FACTORY'
  | 'TOWER'
  | 'ROCKET_LAUNCHER'
  | 'HOME_BASE'
  | 'EMPTY_FIELD';

export type FactoryType =
  | 'METAL_FACTORY'
  | 'BUILDING_MATERIALS_FACTORY'
  | 'ELECTRICITY_FACTORY';

export type TowerType = 'TOWER' | 'HOME_BASE';

export type Player = {
  id: string;
  nickname: string;
  resources: ResourceSet;
  upgrades: Array<LabUpgrade>;
  rocketStrikesDone: number;
  builtFactories: number;
  builtTowers: number;
};

export type ResourceSet = {
  metal: number;
  buildingMaterials: number;
  electricity: number;
};

export type StateManager = {
  gameState: string;
  timeout: string;
  currentPlayerId?: string;
  turnCounter: number;
  winnerId?: string;
  firstPlayerId: string;
};

export type BoardLocation = {
  row: number;
  col: number;
};

export type GameEvent = {
  type: EventType;
  content: TrainingEventContent | BuildBuildingEventContent;
};

export type TrainingEventContent = {
  turnsToExecute: number;
  location: BoardLocation;
  unitType: UnitType;
  amount: number;
};

export type BuildBuildingEventContent = {
  turnsToExecute: number;
  location: BoardLocation;
  buildingType: BuildingType;
};

export type EventType =
  | 'LAB_EVENT'
  | 'BUILD'
  | 'UPGRADE'
  | 'TRAINING'
  | 'MOVE_UNITS'
  | 'ATTACK'
  | 'FIRE_ROCKET';

export type LabUpgrade =
  // COMBAT
  | 'REUSABLE_PARTS'
  | 'MEDIUM_PRODUCTION'
  | 'IMPROVED_DROIDS'
  | 'IMPROVED_TANKS'
  | 'MASS_PRODUCTION'
  | 'IMPROVED_CANNONS'
  | 'ADVANCED_TACTICS'

  // CONTROL
  | 'SCARAB_SCANNERS'
  | 'KING_OF_DESERT'
  | 'FACTORY_TURRET'
  | 'GOLD_DIGGERS'
  | 'TOWER_CREATOR'
  | 'THE_GREAT_FORTRESS'
  | 'SUPER_SONIC_ROCKETS'

  // PRODUCTION
  | 'HOME_SWEET_HOME'
  | 'MORE_METAL'
  | 'MORE_BUILDING_MATERIALS'
  | 'MORE_ELECTRICITY'
  | 'PRODUCTION_MANAGERS'
  | 'FACTORY_BUILDERS'
  | 'PRODUCTION_AI';
