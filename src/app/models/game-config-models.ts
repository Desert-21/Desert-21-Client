export type GameBalanceConfig = {
  buildings: AllBuildingsBalance;
  combat: AllCombatBalance;
};

export type AllBuildingsBalance = {
  factory: FactoryConfig;
  tower: TowerConfig;
  homeBase: HomeBaseConfig;
  rocketLauncher: RocketLauncherConfig;
};

export type AllCombatBalance = {
  droids: CombatUnitConfig;
  tanks: CombatUnitConfig;
  cannons: CombatUnitConfig;
};


export type LeveledValue = {
  level1: number;
  level2: number;
  level3: number;
  level4: number;
};

export type BuildingConfig = {
  cost: LeveledValue;
};

export type FactoryConfig = BuildingConfig & {
  production: LeveledValue;
};

export type TowerConfig = BuildingConfig & {
  baseProtection: LeveledValue;
  unitBonus: LeveledValue;
};

export type HomeBaseConfig = TowerConfig & {
  production: number;
};

export type RocketLauncherConfig = {
  firstUseCost: number;
  nextUseCostIncrease: number;
};

export type CombatUnitConfig = {
  cost: number;
  power: number;
  turnsToTrain: number;
  fieldsTraveledPerTurn: number;
  smallProduction: number;
  mediumProduction: number;
  massProduction: number;
};



