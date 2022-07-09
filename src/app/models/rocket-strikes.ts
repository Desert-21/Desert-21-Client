import { GameBalanceConfig } from './game-config-models';
import { Field } from './game-models';

export const getRocketStrikeCost = (
  gameBalance: GameBalanceConfig,
  rocketStrikesPerformed: number,
  ownedFields: Array<Field>
): number => {
  const config = gameBalance.general;
  const baseCost =
    config.baseRocketStrikePrice +
    rocketStrikesPerformed * config.rocketStrikePricePerUsage;
  const rocketsOwned = ownedFields.filter(
    (f) => f.building.type === 'ROCKET_LAUNCHER'
  ).length;
  const discountRatio = Math.pow(0.5, rocketsOwned - 1);
  return Math.round(baseCost * discountRatio);
};

// todo: implement somwewhere in UI
