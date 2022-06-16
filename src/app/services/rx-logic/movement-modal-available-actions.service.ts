import { Injectable } from '@angular/core';
import {
  AllCombatBalance,
  GameBalanceConfig,
} from 'src/app/models/game-config-models';
import { BoardLocation, Field, Player } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import { getFastestUnitsSpeed } from 'src/app/utils/army-utils';
import { findByFieldLocation } from 'src/app/utils/location-utils';
import { GameContextService } from './game-context.service';
import { LastShortestPathCalculationService } from './last-shortest-path-calculation.service';
import { ResourceProcessor } from './resource-processor';

export type ModalActionType =
  | 'BOMBARD'
  | 'MOVE_UNITS'
  | 'ATTACK'
  | 'FIRE_ROCKET';

@Injectable({
  providedIn: 'root',
})
export class MovementModalAvailableActionsService extends ResourceProcessor<
  Array<ModalActionType>
> {
  constructor(
    private gameContextService: GameContextService,
    private lastShortestPathCalculationService: LastShortestPathCalculationService
  ) {
    super([gameContextService, lastShortestPathCalculationService]);
  }

  protected processData(dataElements: any[]): ModalActionType[] {
    const [context, path] = dataElements as [GameContext, Array<BoardLocation>];
    if (path === null || path.length < 2) {
      return [];
    }
    const fields = context.game.fields;
    const firstLoc = path[0];
    const lastLoc = path[path.length - 1];
    const fromField = findByFieldLocation(firstLoc.row, firstLoc.col, fields);
    const toField = findByFieldLocation(lastLoc.row, lastLoc.col, fields);
    const playersId = context.player.id;

    const optionalMoveUnits: ModalActionType = this.canMoveUnits(
      fromField,
      toField,
      playersId,
      path,
      context.balance.combat
    )
      ? 'MOVE_UNITS'
      : null;

    const optionalAttack: ModalActionType = this.canAttack(
      fromField,
      toField,
      playersId,
      path,
      context.balance.combat
    )
      ? 'ATTACK'
      : null;

    const optionalBombard: ModalActionType = this.canBombard(
      fromField,
      toField,
      context.player,
      path,
      context.balance.combat
    )
      ? 'BOMBARD'
      : null;

    const optionalFireRocket: ModalActionType = this.canFireRocket(
      fromField,
      playersId
    )
      ? 'FIRE_ROCKET'
      : null;

    return [
      optionalMoveUnits,
      optionalAttack,
      optionalBombard,
      optionalFireRocket,
    ].filter((action) => action !== null);
  }

  private canMoveUnits(
    fromField: Field,
    toField: Field,
    playersId: string,
    path: Array<BoardLocation>,
    balanceConfig: AllCombatBalance
  ): boolean {
    if (fromField.ownerId !== playersId || toField.ownerId !== playersId) {
      return false;
    }
    const maxSpeed = getFastestUnitsSpeed(fromField.army, balanceConfig);
    const actualPathLength = path.length - 1;
    if (maxSpeed < actualPathLength) {
      return false;
    }
    return true;
  }

  private canAttack(
    fromField: Field,
    toField: Field,
    playersId: string,
    path: Array<BoardLocation>,
    balanceConfig: AllCombatBalance
  ): boolean {
    if (fromField.ownerId !== playersId || toField.ownerId === playersId) {
      return false;
    }
    const maxSpeed = getFastestUnitsSpeed(fromField.army, balanceConfig);
    const actualPathLength = path.length - 1;
    if (maxSpeed < actualPathLength) {
      return false;
    }
    return true;
  }

  private canBombard(
    fromField: Field,
    toField: Field,
    player: Player,
    path: Array<BoardLocation>,
    balanceConfig: AllCombatBalance
  ): boolean {
    const playersId = player.id;
    if (fromField.ownerId !== playersId || toField.ownerId === playersId) {
      return false;
    }
    const hasCannons = fromField.army.cannons > 0;
    if (!hasCannons) {
      return false;
    }
    if (!player.upgrades.includes('IMPROVED_CANNONS')) {
      return false;
    }
    const cannonsSpeed = balanceConfig.cannons.fieldsTraveledPerTurn;
    const actualPathLength = path.length - 1;
    if (cannonsSpeed < actualPathLength) {
      return false;
    }
    return true;
  }

  private canFireRocket(fromField: Field, playerId: string): boolean {
    return (
      fromField.ownerId === playerId &&
      fromField.building.type === 'ROCKET_LAUNCHER'
    );
  }
}
