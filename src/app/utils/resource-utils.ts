import { GameBalanceConfig } from '../models/game-config-models';
import {
  Building,
  FactoryType,
  Field,
  Game,
  LabUpgrade,
  Player,
  ResourceSet,
} from '../models/game-models';
import { buildingToConfig, buildingTypeToConfig } from './balance-utils';
import { getLeveledValueByLevel, isFactory } from './building-utils';
import { flattenFields } from './location-utils';
import { underscoreToLowerCamelCase } from './text-utils';

const ofEachResource = (amount: number): ResourceSet => ({
  metal: amount,
  buildingMaterials: amount,
  electricity: amount,
});

const ofMetal = (amount: number): ResourceSet => ({
  metal: amount,
  buildingMaterials: 0,
  electricity: 0,
});

const ofBuildingMaterials = (amount: number): ResourceSet => ({
  metal: 0,
  buildingMaterials: amount,
  electricity: 0,
});

const ofElectricity = (amount: number): ResourceSet => ({
  metal: 0,
  buildingMaterials: 0,
  electricity: amount,
});

export const addResources = (
  r1: ResourceSet,
  r2: ResourceSet
): ResourceSet => ({
  metal: r1.metal + r2.metal,
  buildingMaterials: r1.buildingMaterials + r2.buildingMaterials,
  electricity: r1.electricity + r2.electricity,
});

const multiplyResourcesBy = (
  resourceSet: ResourceSet,
  multiplier: number
): ResourceSet => ({
  metal: Math.round(resourceSet.metal * multiplier),
  buildingMaterials: Math.round(resourceSet.buildingMaterials * multiplier),
  electricity: Math.round(resourceSet.electricity * multiplier),
});

export const calculateResourceProduction = (
  game: Game,
  player: Player,
  balance: GameBalanceConfig
): ResourceSet => {
  let productionAccumulator = getHomeBaseProduction(balance, player);

  const playersFields = flattenFields(game.fields).filter(
    (f) => f.ownerId === player.id
  );
  const producedByFields = getProductionOfFieldsWithoutBuildings(
    playersFields,
    player,
    balance
  );
  productionAccumulator = addResources(productionAccumulator, producedByFields);

  const producedByFactories = getProductionOfFactories(
    playersFields,
    balance,
    player
  );
  productionAccumulator = addResources(
    productionAccumulator,
    producedByFactories
  );

  const producedByAi = getAIProduction(player, balance);
  productionAccumulator = addResources(productionAccumulator, producedByAi);

  return appendProductionManagersUpgrade(
    productionAccumulator,
    player,
    balance
  );
};

const getHomeBaseProduction = (
  balance: GameBalanceConfig,
  player: Player
): ResourceSet => {
  const baseProduction = balance.buildings.homeBase.production;
  const potentialBonus =
    balance.upgrades.production.balanceConfig.homeSweetHomeProductionBonus;
  const productionAfterUpgrade = Math.round(
    baseProduction * (1 + potentialBonus)
  );
  const productionOfEach = player.upgrades.includes('HOME_SWEET_HOME')
    ? productionAfterUpgrade
    : baseProduction;
  return ofEachResource(productionOfEach);
};

const getProductionOfFieldsWithoutBuildings = (
  fields: Array<Field>,
  player: Player,
  balance: GameBalanceConfig
): ResourceSet => {
  const baseProduction = balance.general.productionPerField;
  const goldDiggersBonus =
    balance.upgrades.control.balanceConfig.goldDiggersProductionPerFieldBonus;
  const upgradedProduction = baseProduction + goldDiggersBonus;
  const actualProductionPerField = player.upgrades.includes('GOLD_DIGGERS')
    ? upgradedProduction
    : baseProduction;

  const fieldsAmount = fields.length - 1; // excluding home base
  const produced = fieldsAmount * actualProductionPerField;

  return ofEachResource(produced);
};

const getFactoryReleatedUpgrade = (factory: FactoryType): LabUpgrade => {
  switch (factory) {
    case 'METAL_FACTORY':
      return 'MORE_METAL';
    case 'BUILDING_MATERIALS_FACTORY':
      return 'MORE_BUILDING_MATERIALS';
    case 'ELECTRICITY_FACTORY':
      return 'MORE_ELECTRICITY';
  }
};

const getProductionOfFactories = (
  ownedFields: Array<Field>,
  balance: GameBalanceConfig,
  player: Player
): ResourceSet => {
  return ownedFields
    .map((f) => f.building)
    .filter(isFactory)
    .map((building) => getProductionOfFactory(building, balance, player))
    .reduce(addResources, ofEachResource(0));
};

const getProductionOfFactory = (
  building: Building,
  balance: GameBalanceConfig,
  player: Player
): ResourceSet => {
  const config = buildingToConfig(balance.buildings, building);
  const baseProduction = getLeveledValueByLevel(
    config.production,
    building.level
  );

  const upgradeNeeded = getFactoryReleatedUpgrade(building.type as FactoryType);
  const ownsUpgrade = player.upgrades.includes(upgradeNeeded);

  const labConfigStaticBonusName = `${underscoreToLowerCamelCase(
    upgradeNeeded
  )}ProductionStaticBonus`;
  const labConfigRelativeBonusName = `${underscoreToLowerCamelCase(
    upgradeNeeded
  )}ProductionRelativeBonus`;

  const staticBonus =
    balance.upgrades.production.balanceConfig[labConfigStaticBonusName];
  const relativeBonus =
    balance.upgrades.production.balanceConfig[labConfigRelativeBonusName];

  const production = ownsUpgrade
    ? Math.round(baseProduction * (1 + relativeBonus)) + staticBonus
    : baseProduction;

  switch (building.type as FactoryType) {
    case 'METAL_FACTORY':
      return ofMetal(production);
    case 'BUILDING_MATERIALS_FACTORY':
      return ofBuildingMaterials(production);
    case 'ELECTRICITY_FACTORY':
      return ofElectricity(production);
  }
};

const getAIProduction = (
  player: Player,
  balance: GameBalanceConfig
): ResourceSet => {
  const ai = player.ai;
  const production = ai.activated
    ? ai.currentProduction +
      balance.upgrades.production.balanceConfig.productionAiIncreasePerTurn
    : 0;
  return ofEachResource(production);
};

const appendProductionManagersUpgrade = (
  baseTotalResourceSet: ResourceSet,
  player: Player,
  balance: GameBalanceConfig
): ResourceSet => {
  const ownsUpgrade = player.upgrades.includes('PRODUCTION_MANAGERS');
  const multiplier =
    1 +
    balance.upgrades.production.balanceConfig.productionManagersProductionBonus;
  return ownsUpgrade
    ? multiplyResourcesBy(baseTotalResourceSet, multiplier)
    : baseTotalResourceSet;
};
