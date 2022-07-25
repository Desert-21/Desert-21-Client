import { EstimatedArmy, FightingArmy } from '../models/army-ranges';
import { GameBalanceConfig } from '../models/game-config-models';
import { Army, Building, Player } from '../models/game-models';
import { BattleResult } from '../models/notification-models';
import {
  calculateAttackingArmyPower,
  calculateBombardingAttackersPower,
  calculateDefendingArmyPower,
  calculateDefendingFightingArmyPower,
} from './army-power-calculator';

export const damageArmyByRocket = (
  army: EstimatedArmy,
  balance: GameBalanceConfig
): EstimatedArmy => {
  return army.mapArmy((fightingArmy) => {
    const damage = balance.general.rocketStrikeDamage;
    const remainingUnitsRatio = 1 - damage;
    const droids = Math.round(fightingArmy.droids * remainingUnitsRatio);
    const tanks = Math.round(fightingArmy.tanks * remainingUnitsRatio);
    const cannons = Math.round(fightingArmy.cannons * remainingUnitsRatio);
    return { droids, tanks, cannons, scarabs: fightingArmy.scarabs };
  });
};

export const performBombardingOnEstimatedArmy = (
  attackerCannons: number,
  estimatedDefenders: EstimatedArmy,
  balance: GameBalanceConfig,
  defenderPlayer: Player,
  attackerPlayer: Player,
  building: Building
): EstimatedArmy => {
  return estimatedDefenders.mapArmy((army) => {
    return performBombardingOnArmy(
      attackerCannons,
      army,
      balance,
      defenderPlayer,
      attackerPlayer,
      building
    );
  });
};

export const performBombardingOnArmy = (
  attackerCannons: number,
  defenders: FightingArmy,
  balance: GameBalanceConfig,
  defenderPlayer: Player,
  attackerPlayer: Player,
  building: Building
): FightingArmy => {
  const defendersPower = calculateDefendingArmyPower(
    defenders,
    0,
    balance,
    defenderPlayer,
    attackerPlayer,
    building
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

export const performBattle = (
  attackers: Army,
  defenders: FightingArmy,
  attackingPlayer: Player,
  defendingPlayer: Player,
  balance: GameBalanceConfig,
  building: Building
): BattleResult => {
  const attackersPower = calculateAttackingArmyPower(
    attackers,
    balance,
    attackingPlayer
  );
  const defendersPower = calculateDefendingFightingArmyPower(
    defenders,
    balance,
    defendingPlayer,
    attackingPlayer,
    building
  );
  const attackerHaveWon = attackersPower > defendersPower;
  const winnersPower = attackerHaveWon ? attackersPower : defendersPower;
  const losersPower = attackerHaveWon ? defendersPower : attackersPower;

  const destructionRatio = calculateDestructionRatio(
    winnersPower,
    losersPower,
    balance
  );

  const attackersAfter = calculateAttackersArmyAfter(
    attackers,
    attackerHaveWon,
    destructionRatio,
    attackingPlayer,
    balance
  );
  const defendersAfter = calculateDefendersArmyAfter(
    defenders,
    attackerHaveWon,
    destructionRatio
  );
  return {
    attackersBefore: { ...attackers, scarabs: 0 },
    defendersBefore: defenders,
    attackersAfter,
    defendersAfter,
    haveAttackersWon: attackerHaveWon,
    wasUnoccupied: false,
  };
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

const calculateAttackersArmyAfter = (
  attackersBefore: Army,
  attackerHasWon: boolean,
  destructionRatio: number,
  attacker: Player,
  gameBalance: GameBalanceConfig
): FightingArmy => {
  if (!attackerHasWon) {
    return { droids: 0, tanks: 0, cannons: 0, scarabs: 0 };
  }
  const reusablePartsDamageRatio =
    1 -
    gameBalance.upgrades.combat.balanceConfig.reusablePartsUnitsFractionSaved;

  const actualDestructionRatio = attacker.upgrades.includes('REUSABLE_PARTS')
    ? destructionRatio * reusablePartsDamageRatio
    : destructionRatio;
  const remainingUnitsRatio = 1 - actualDestructionRatio;

  const droids = Math.floor(attackersBefore.droids * remainingUnitsRatio);
  const tanks = Math.floor(attackersBefore.tanks * remainingUnitsRatio);
  const cannons = Math.floor(attackersBefore.cannons * remainingUnitsRatio);
  return { droids, tanks, cannons, scarabs: 0 };
};
