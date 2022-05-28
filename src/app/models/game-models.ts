export type Game = {
  gameId: string;
  players: Array<Player>;
  fields: Array<Array<Field>>;
  stateManager: StateManager;
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
};

export type BoardLocation = {
  row: number;
  col: number;
};
