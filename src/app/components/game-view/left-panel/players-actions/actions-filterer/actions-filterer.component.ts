import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import {
  AttackAction,
  BombardAction,
  BuildBuildingAction,
  MoveUnitsAction,
  PlayersAction,
  TrainAction,
  UpgradeAction,
} from 'src/app/models/actions';
import { BoardLocation, ResourceSet } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import {
  attackStrategy,
  moveUnitsStrategy,
} from 'src/app/services/rx-logic/double-field-selection/drag-and-drop/shortest-path-startegies';
import { ActionClearingNotificationService } from 'src/app/services/rx-logic/resolution-phase/action-clearing-notification.service';
import { AvailableResourcesService } from 'src/app/services/rx-logic/shared/available-resources.service';
import { CurrentActionsService } from 'src/app/services/rx-logic/shared/current-actions.service';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import {
  getFrozenUnitsAtLocation,
  getSlowestUnitsSpeed,
  subtractArmies,
} from 'src/app/utils/army-utils';
import {
  findByFieldLocation,
  flattenFields,
} from 'src/app/utils/location-utils';

type MovementAction = MoveUnitsAction | AttackAction | BombardAction;

@Component({
  selector: 'app-actions-filterer',
  template: '',
  styleUrls: [],
})
export class ActionsFiltererComponent implements OnInit {
  constructor(
    private contextService: GameContextService,
    private availableResourcesResvice: AvailableResourcesService,
    private currentActionsService: CurrentActionsService,
    private actionClearingNotificationService: ActionClearingNotificationService
  ) {}

  lastTotalInvalidActions = 0;

  ngOnInit(): void {
    combineLatest([
      this.contextService.getStateUpdates(),
      this.availableResourcesResvice.getStateUpdates(),
    ]).subscribe(([context, availableResources]) => {
      const actions = context.currentActions;
      const selfValidatedInvalidActions = actions.filter(
        (a) => !this.isActionValid(a, context, availableResources)
      );
      // movement actions not valid from fields perspective
      const invalidActionsFromFieldPerspective =
        this.validateActionsFromUnitsAvailabilityPerspective(actions, context);

      const totalInvalidActions =
        selfValidatedInvalidActions.length +
        invalidActionsFromFieldPerspective.length;
      if (this.lastTotalInvalidActions === totalInvalidActions) {
        this.lastTotalInvalidActions = totalInvalidActions;
        return;
      }
      this.lastTotalInvalidActions = totalInvalidActions;
      const shouldRemoveAllActions = totalInvalidActions > 0;
      if (shouldRemoveAllActions) {
        this.currentActionsService.clearActions();
        this.actionClearingNotificationService.set(1);
      }
    });
  }

  private validateActionsFromUnitsAvailabilityPerspective(
    actions: Array<PlayersAction<any>>,
    context: GameContext
  ): Array<PlayersAction<any>> {
    const movementActions = actions
      .filter((a) => ['ATTACK', 'BOMBARD', 'MOVE_UNITS'].includes(a.getType()))
      .map((a) => a as MovementAction);
    const fromLocationToActionsMap =
      this.groupActionsByFromLocations(movementActions);
    const toRemove = this.getRedundantActionsByUnitsAvailability(
      fromLocationToActionsMap,
      context
    );
    return toRemove;
  }

  private getRedundantActionsByUnitsAvailability(
    fromMap: Map<string, Array<MovementAction>>,
    context: GameContext
  ): Array<MovementAction> {
    const redundantActions = new Set<MovementAction>();
    for (const [key, actions] of fromMap.entries()) {
      const [row, col] = key.split('-');
      const location: BoardLocation = {
        row: parseInt(row, 10),
        col: parseInt(col, 10),
      };
      const frozenUnits = getFrozenUnitsAtLocation(location, actions);
      const armyAtField = findByFieldLocation(
        location,
        context.game.fields
      ).army;
      const remainingArmy = subtractArmies(armyAtField, frozenUnits);
      const isActionAvailable =
        remainingArmy.droids >= 0 &&
        remainingArmy.tanks >= 0 &&
        remainingArmy.cannons >= 0;
      if (!isActionAvailable) {
        actions.forEach((a) => {
          redundantActions.add(a);
        });
      }
    }
    return Array.from(redundantActions);
  }

  private groupActionsByFromLocations(
    actions: Array<MovementAction>
  ): Map<string, Array<MovementAction>> {
    const map = new Map<string, Array<MovementAction>>();
    actions.forEach((a) => {
      const key = `${a.from.row}-${a.from.col}`;
      if (map.has(key)) {
        map.get(key).push(a);
      } else {
        map.set(key, [a]);
      }
    });
    return map;
  }

  private isActionValid(
    action: PlayersAction<any>,
    context: GameContext,
    availableResources: ResourceSet
  ): boolean {
    const type = action.getType();
    switch (type) {
      case 'LAB_EVENT':
        return true;
      case 'BUILD':
      case 'TRAIN':
      case 'UPGRADE':
        const castStaticAction = action as
          | BuildBuildingAction
          | TrainAction
          | UpgradeAction;
        const staticLocation = castStaticAction.location;
        return (
          context.player.id ===
          findByFieldLocation(staticLocation, context.game.fields).ownerId
        );
      case 'FIRE_ROCKET':
        const ownsRocket = flattenFields(context.game.fields)
          .filter((f) => f.ownerId === context.player.id)
          .some((f) => f.building.type === 'ROCKET_LAUNCHER');
        if (!ownsRocket) {
          return false;
        }
        const hasStillEnoughElectricity = availableResources.electricity >= 0;
        return hasStillEnoughElectricity;
      case 'ATTACK':
      case 'BOMBARD':
      case 'MOVE_UNITS':
        const castMovementAction = action as
          | AttackAction
          | BombardAction
          | MoveUnitsAction;
        const fromLocation = castMovementAction.from;
        if (
          context.player.id !==
          findByFieldLocation(fromLocation, context.game.fields).ownerId
        ) {
          return false;
        }
        const pathFindStrategy =
          type === 'MOVE_UNITS' ? moveUnitsStrategy : attackStrategy;
        const unvalidatedNewPath = pathFindStrategy.findShortestPath(
          { from: castMovementAction.from, to: castMovementAction.to },
          context
        );
        if (!unvalidatedNewPath) {
          return false;
        }
        const army =
          type === 'ATTACK'
            ? (castMovementAction as AttackAction).army
            : {
                droids: 0,
                tanks: 0,
                cannons: (castMovementAction as BombardAction).cannonsAmount,
              };
        const slowestSpeed = getSlowestUnitsSpeed(army, context.balance.combat);
        if (slowestSpeed < unvalidatedNewPath.length - 1) {
          return false;
        }
        return true;
    }
  }
}
