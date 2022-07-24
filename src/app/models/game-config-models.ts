import { LabUpgrade } from './game-models';

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
  rocketStrikeDamage: number;
  baseRocketStrikePrice: number;
  rocketStrikePricePerUsage: number;
};

export type AllUpgradesBalance = {
  combat: CombatBranch;
  control: ControlBranch;
  production: ProductionBranch;
};

export type CombatBranch = Branch & {
  balanceConfig: CombatBranchConfig;
  costConfig: CombatBranchCostConfig;
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

export type CombatBranchCostConfig = {
  reusableParts: number;
  mediumProduction: number;
  improvedDroids: number;
  improvedTanks: number;
  massProduction: number;
  improvedCannons: number;
  advancedTactics: number;
};

export type ControlBranch = Branch & {
  balanceConfig: ControlBranchConfig;
  costConfig: ControlBranchCostConfig;
};

export type ControlBranchConfig = {
  goldDiggersProductionPerFieldBonus: number;
  factoryTurretTowerLevel: number;
  scarabScannersPowerDecreaseRatio: number;
  towerCreatorMaxTowersBuilt: number;
};

export type ControlBranchCostConfig = {
  scarabScanners: number;
  kingOfDesert: number;
  factoryTurret: number;
  goldDiggers: number;
  towerCreator: number;
  theGreatFortress: number;
  superSonicRockets: number;
};

export type ProductionBranch = Branch & {
  balanceConfig: ProductionBranchConfig;
  costConfig: ProductionBranchCostConfig;
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

export type ProductionBranchCostConfig = {
  homeSweetHome: number;
  moreMetal: number;
  moreBuildingMaterials: number;
  moreElectricity: number;
  productionManagers: number;
  factoryBuilders: number;
  productionAi: number;
};

export type Branch = {
  baseUpgrade: LabUpgrade;
  firstTierUpgrades: Array<LabUpgrade>;
  secondTierUpgrades: Array<LabUpgrade>;
  superUpgrade: LabUpgrade;
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
  scarabs: ScarabConfig;
  general: GeneralCombatConfig;
};

export type ScarabConfig = {
  power: number;
  baseGeneration: number;
  additionalGenerationPerTurn: number;
  generationBias: number;
};

export type GeneralCombatConfig = {
  destructionFunctionPolynomial: Array<number>;
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
