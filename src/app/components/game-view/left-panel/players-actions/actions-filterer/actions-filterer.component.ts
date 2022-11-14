import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import {
  AttackAction,
  BombardAction,
  BuildBuildingAction,
  FireRocketAction,
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
import { RocketStrikeCostService } from 'src/app/services/rx-logic/double-field-selection/rocket-strike-cost.service';
import { AvailableResourcesService } from 'src/app/services/rx-logic/shared/available-resources.service';
import { CurrentActionsService } from 'src/app/services/rx-logic/shared/current-actions.service';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import { ToastsService } from 'src/app/services/rx-logic/shared/toasts.service';
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
    private toastsService: ToastsService,
    private rocketCostCalculator: RocketStrikeCostService
  ) {}

  lastTotalInvalidActions = 0;

  ngOnInit(): void {
    combineLatest([
      this.contextService.getStateUpdates(),
      this.availableResourcesResvice.getStateUpdates(),
      this.rocketCostCalculator.getStateUpdates(),
    ]).subscribe(([context, availableResources, rocketStrikeCost]) => {
      const actions = context.currentActions;
      // rocket cost revalidation first
      const actionsUpdate = this.updateRocketActions(context.currentActions, rocketStrikeCost.current);
      if (actionsUpdate.updatedAmount > 0) {
        this.currentActionsService.setActions(actionsUpdate.actions);
        return;
      }

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
        this.toastsService.add({
          title: 'Your pre-moved actions have been removed!',
          description:
            "This happened because at least one of them could not be executed anymore after opponents turn. Next time make sure that you pre-move only the actions that won't be interrupted by enemy attacks!",
          theme: 'DANGER',
        });
      }
    });
  }

  // in case of rocket strikes being able to be just shifted from conquered to remaining one
  private updateRocketActions(
    actions: Array<PlayersAction<any>>,
    rocketStrikeCost: number,
  ): { actions: Array<PlayersAction<any>>, updatedAmount: number } {
    let updatedAmount = 0;
    for (const action of actions) {
      if (action.getType() !== 'FIRE_ROCKET') {
        continue;
      }
      const parsed = action as FireRocketAction;
      if (parsed.getCost().electricity === rocketStrikeCost) {
        continue;
      }
      updatedAmount++;
      parsed.electricityCost = rocketStrikeCost;
    }
    return { actions, updatedAmount };
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
