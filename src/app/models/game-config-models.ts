export type GameBalanceConfig = {
  buildings: AllBuildingsBalance;
  combat: AllCombatBalance;
  general: GeneralUpgrades;
  upgrades: AllUpgradesBalance;
};

export type GeneralUpgrades = {
  fogOfWar1: number;
  fogOfWar2: number;
  productionPerField: number;
  startingResources: number;
};

export type AllUpgradesBalance = {
  combat: CombatBranch;
  control: ControlBranch;
  production: ProductionBranch;
};

export type CombatBranch = Branch & {
  combatBranchConfig: CombatBranchConfig;
};

export type CombatBranchConfig = {
  advancedTacticsPowerBonusPerReferencePower: number;
  advancedTacticsReferencePower: number;
  improvedCannonsBombardingPowerFraction: number;
  improvedDroidsBaseAtTowerDefenceBonus: number;
  improvedDroidsBaseDefenceBonus: number;
  improvedTanksPowerBonus: number;
  reusablePartsUnitsFractionSaved: number;
};

export type ControlBranch = Branch & {
  controlBranchConfig: ControlBranchConfig;
};

export type ControlBranchConfig = {
  goldDiggersProductionPerFieldBonus: number;
  factoryTurretTowerLevel: number;
  scarabScannersPowerDecreaseRatio: number;
  towerCreatorMaxTowersBuilt: number;
};

export type ProductionBranch = Branch & {
  productionBranchConfig: ProductionBranchConfig;
};

export type ProductionBranchConfig = {
  factoryBuildingMaxFactoriesBuilt: number;
  homeSweetHomeProductionBonus: number;
  moreBuildingMaterialsProductionRelativeBonus: number;
  moreBuildingMaterialsProductionStaticBonus: number;
  moreElectricityProductionRelativeBonus: number;
  moreElectricityProductionStaticBonus: number;
  moreMetalProductionRelativeBonus: number;
  moreMetalProductionStaticBonus: number;
  productionAiIncreasePerTurn: number;
  productionManagersProductionBonus: number;
};

export type Branch = {
  baseUpgrade: string;
  firstTierUpgrades: Array<string>;
  secondTierUpgrades: Array<string>;
  superUpgrade: string;
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
