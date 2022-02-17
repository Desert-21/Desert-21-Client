export type Game = {
  id: string;
  players: Array<Player>;
  fields: Array<Array<Field>>;
}

export type Field = {
  building: Building;
  ownerId: string,
  army: Army
}

export type Army = {
  droids: number;
  tanks: number;
  cannons: number;
}

export type Building = {
  type: string;
  level: number;
}

export type Player = {
  id: string;
  nickname: string;
  resources: ResourceSet;
}

export type ResourceSet = {
  metal: number;
  buildingMaterials: number;
  electricity: number;
}
