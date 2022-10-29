import { Injectable } from '@angular/core';
import {
  CombatUnitConfig,
  GameBalanceConfig,
} from 'src/app/models/game-config-models';
import { GameBalanceService } from '../../http/game-balance.service';
import { ResourceProcessor } from '../templates/resource-processor';

export type SingleUnitStats = {
  power: number;
  powerRatio: number;
  movementSpeed: number;
  movementSpeedRatio: number;
  trainingSpeed: number;
  trainingSpeedRatio: number;
  cost: number;
  costRatio: number;
};

export type ScarabStats = {
  power: number;
  powerRatio: number;
};

export type UnitStats = {
  droids: SingleUnitStats;
  tanks: SingleUnitStats;
  cannons: SingleUnitStats;
  scarabs: ScarabStats;
};

export const defaultSingleUnitStats: SingleUnitStats = {
  power: 0,
  powerRatio: 0,
  movementSpeed: 0,
  movementSpeedRatio: 0,
  trainingSpeed: 0,
  trainingSpeedRatio: 0,
  cost: 0,
  costRatio: 0,
};

export const defaultUnitStats: UnitStats = {
  droids: defaultSingleUnitStats,
  tanks: defaultSingleUnitStats,
  cannons: defaultSingleUnitStats,
  scarabs: {
    power: 0,
    powerRatio: 0,
  },
};

@Injectable({
  providedIn: 'root',
})
export class UnitStatsService extends ResourceProcessor<UnitStats> {
  constructor(private gameBalanceService: GameBalanceService) {
    super([gameBalanceService]);
  }

  protected processData(dataElements: any[]): UnitStats {
    const [balance] = dataElements as [GameBalanceConfig];

    const { droids, tanks, cannons } = balance.combat;
    const units = [droids, tanks, cannons];
    const maxPower = this.max(units, (u) => u.power);
    const maxMovementSpeed = this.max(units, (u) => u.fieldsTraveledPerTurn);
    const maxTrainingSpeed = this.max(units, (u) => 1 / u.turnsToTrain);
    const maxCost = this.max(units, (u) => u.cost);

    const [droidsStats, tanksStats, cannonsStats] = units.map((u) =>
      this.unitConfigToStatus(
        u,
        maxPower,
        maxMovementSpeed,
        maxTrainingSpeed,
        maxCost
      )
    );

    const scarabStats: ScarabStats = {
      power: balance.combat.scarabs.power,
      powerRatio: balance.combat.scarabs.power / maxPower,
    };

    return {
      droids: droidsStats,
      tanks: tanksStats,
      cannons: cannonsStats,
      scarabs: scarabStats,
    };
  }

  private unitConfigToStatus(
    unitConfig: CombatUnitConfig,
    maxPower: number,
    maxMovementSpeed: number,
    maxTrainingSpeed: number,
    maxCost: number
  ): SingleUnitStats {
    return {
      power: unitConfig.power,
      powerRatio: unitConfig.power / maxPower,
      movementSpeed: unitConfig.fieldsTraveledPerTurn,
      movementSpeedRatio: unitConfig.fieldsTraveledPerTurn / maxMovementSpeed,
      trainingSpeed: unitConfig.turnsToTrain,
      trainingSpeedRatio: 1 / unitConfig.turnsToTrain / maxTrainingSpeed,
      cost: unitConfig.cost,
      costRatio: unitConfig.cost / maxCost,
    };
  }

  private max<T>(array: Array<T>, fun: (a: T) => number): number {
    return array.reduce((prev, next) => {
      const tested = fun(next);
      if (tested > prev) {
        return tested;
      }
      return prev;
    }, 0);
  }
}
