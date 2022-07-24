import { EstimatedArmy, FightingArmy } from '../models/army-ranges';
import { GameBalanceConfig } from '../models/game-config-models';
import { Army, Building, Player } from '../models/game-models';
import {
  calculateArmyPower,
  calculateBombardingAttackersPower,
  calculateFightingArmyPower,
} from './army-power-calculator';

export const damageArmyByRocket = (
  army: EstimatedArmy,
  balance: GameBalanceConfig
): EstimatedArmy => {
  return army.mapArmy((fightingArmy) => {
    const damage = balance.general.rocketStrikeDamage;
    const remainingUnitsRatio = 1 - damage;
    const droids = fightingArmy.droids * remainingUnitsRatio;
    const tanks = fightingArmy.tanks * remainingUnitsRatio;
    const cannons = fightingArmy.cannons * remainingUnitsRatio;
    return { droids, tanks, cannons, scarabs: fightingArmy.scarabs };
  });
};

export const performBombardingOnEstimatedArmy = (
  attackerCannons: number,
  estimatedDefenders: EstimatedArmy,
  balance: GameBalanceConfig,
  defenderPlayer: Player,
  building: Building
): EstimatedArmy => {
  return estimatedDefenders.mapArmy((army) => {
    return performBombardingOnArmy(
      attackerCannons,
      army,
      balance,
      defenderPlayer,
      building
    );
  });
};

export const performBombardingOnArmy = (
  attackerCannons: number,
  defenders: FightingArmy,
  balance: GameBalanceConfig,
  defenderPlayer: Player,
  building: Building
): FightingArmy => {
  const defendersPower = calculateFightingArmyPower(
    defenders,
    balance,
    defenderPlayer,
    building,
    true
  );
  const attackersPower = calculateBombardingAttackersPower(
    attackerCannons,
    balance
  );
  const attackerHasWon = attackersPower > defendersPower;
  if (attackerHasWon) {
    return { droids: 0, tanks: 0, cannons: 0, scarabs: 0 };
  }
  const destructionRatio = calculateDestructionRatio(
    defendersPower,
    attackersPower,
    balance
  );
  return calculateDefendersArmyAfter(defenders, false, destructionRatio);
};

const calculateDestructionRatio = (
  winnersPower: number,
  losersPower: number,
  balance: GameBalanceConfig
): number => {
  winnersPower++;
  losersPower++; // avoid division by 0
  const powersRatio = losersPower / winnersPower;
  const polynomial = balance.combat.general.destructionFunctionPolynomial;
  return applyDestructionPolynomialOnPowersRatio(polynomial, powersRatio);
};

const applyDestructionPolynomialOnPowersRatio = (
  polynomial: Array<number>,
  powersRatio: number
): number => {
  let accumulator = 0;
  for (let i = 0; i < polynomial.length; i++) {
    const index = polynomial.length - 1 - i;
    const coefficient = polynomial[index];
    accumulator += coefficient * Math.pow(powersRatio, i);
  }
  return accumulator;
};

const calculateDefendersArmyAfter = (
  defendersBefore: FightingArmy,
  attackerHasWon: boolean,
  destructionRatio: number
): FightingArmy => {
  if (attackerHasWon) {
    return { droids: 0, tanks: 0, cannons: 0, scarabs: 0 };
  }
  const remainingUnitsRatio = 1 - destructionRatio;

  const droids = Math.floor(defendersBefore.droids * remainingUnitsRatio);
  const tanks = Math.floor(defendersBefore.tanks * remainingUnitsRatio);
  const cannons = Math.floor(defendersBefore.cannons * remainingUnitsRatio);
  const scarabs = Math.floor(defendersBefore.scarabs * remainingUnitsRatio);
  return { droids, tanks, cannons, scarabs };
};
