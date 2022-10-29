import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ActionType,
  AttackAction,
  BombardAction,
  BuildBuildingAction,
  FireRocketAction,
  LabAction,
  MoveUnitsAction,
  PlayersAction,
  TrainAction,
  UpgradeAction,
} from 'src/app/models/actions';
import { GameContext } from 'src/app/models/game-utility-models';
import { CurrentActionsService } from 'src/app/services/rx-logic/shared/current-actions.service';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';

type ActionsCache = {
  gameId: string;
  actions: Array<CachedAction>;
};

type CachedAction = {
  type: ActionType;
  action: PlayersAction<any>;
};

const ACTIONS_CACHE_LOCATION = 'desert-21-actions-cache';

@Component({
  selector: 'app-actions-persister',
  template: '',
  styleUrls: [],
})
export class ActionsPersisterComponent implements OnInit, OnDestroy {
  constructor(
    private gameContextService: GameContextService,
    private gameActionsService: CurrentActionsService
  ) {}

  private hasCheckedLocalCache = false;

  private sub1: Subscription;

  ngOnInit(): void {
    this.sub1 = this.gameContextService
      .getStateUpdates()
      .subscribe((context) => {
        // tslint:disable-next-line: no-unused-expression
        this.checkCurrentCache(context) || this.saveCurrentContext(context);
      });
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
    localStorage.removeItem(ACTIONS_CACHE_LOCATION);
  }

  private checkCurrentCache(context: GameContext): boolean {
    if (this.hasCheckedLocalCache) {
      return false;
    }
    this.hasCheckedLocalCache = true;

    const gameId = context.game.gameId;
    const actionsString = localStorage.getItem(ACTIONS_CACHE_LOCATION);

    if (!actionsString) {
      return false;
    }

    const parsedCache = JSON.parse(actionsString) as ActionsCache;
    if (gameId !== parsedCache.gameId) {
      return false;
    }
    const parsedCachedArray = parsedCache.actions;

    const parsedArray = this.parseCachedActions(parsedCachedArray);
    this.gameActionsService.setActions(parsedArray);
    return true;
  }

  private saveCurrentContext(context: GameContext): void {
    const gameId = context.game.gameId;
    const actions = context.currentActions.map((a) => ({
      type: a.getType(),
      action: a,
    }));
    const cachedValue: ActionsCache = { gameId, actions };
    localStorage.setItem(ACTIONS_CACHE_LOCATION, JSON.stringify(cachedValue));
  }

  private parseCachedActions(
    cached: Array<CachedAction>
  ): Array<PlayersAction<any>> {
    return cached.map((c) => {
      switch (c.type) {
        case 'ATTACK':
          return Object.setPrototypeOf(c.action, AttackAction.prototype);
        case 'BOMBARD':
          return Object.setPrototypeOf(c.action, BombardAction.prototype);
        case 'BUILD':
          return Object.setPrototypeOf(c.action, BuildBuildingAction.prototype);
        case 'FIRE_ROCKET':
          return Object.setPrototypeOf(c.action, FireRocketAction.prototype);
        case 'LAB_EVENT':
          return Object.setPrototypeOf(c.action, LabAction.prototype);
        case 'MOVE_UNITS':
          return Object.setPrototypeOf(c.action, MoveUnitsAction.prototype);
        case 'TRAIN':
          return Object.setPrototypeOf(c.action, TrainAction.prototype);
        case 'UPGRADE':
          return Object.setPrototypeOf(c.action, UpgradeAction.prototype);
      }
    });
  }
}
