import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { Army, BoardLocation, UnitType } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import { MaxArmyService } from 'src/app/services/rx-logic/shared/max-army.service';
import {
  getFrozenUnitsAtLocation,
  getUnitImage,
  subtractArmies,
} from 'src/app/utils/army-utils';
import { findByFieldLocation } from 'src/app/utils/location-utils';

type Quartile = 1 | 2 | 3 | 4;

type UnitOccurence = {
  quartile: Quartile; // which quartile does the amount belong to? <0%; 25%), 25%-50%, 50%-75%, 75%-100%
  relativeAmount: number; // from 0 to 90, where does the amount belong INSIDE IT'S QUARTILE?
  unitType: UnitType;
};

@Component({
  selector: 'app-unit-circles',
  templateUrl: './unit-circles.component.html',
  styleUrls: ['./unit-circles.component.scss'],
})
export class UnitCirclesComponent implements OnInit, OnDestroy {
  fieldLocationSubject = new Subject<BoardLocation>();

  maxArmy: Army = { droids: 100, tanks: 20, cannons: 30 };

  ownershipClass = '';

  // Quartile:
  unitOccurences: Array<UnitOccurence> = [];

  sub1: Subscription;

  constructor(
    private maxArmyService: MaxArmyService,
    private gameContextService: GameContextService
  ) {
    this.sub1 = combineLatest([
      this.maxArmyService.getStateUpdates(),
      this.fieldLocationSubject.asObservable(),
      this.gameContextService.getStateUpdates(),
    ]).subscribe(([maxArmy, location, context]) => {
      this.unitOccurences = this.convertToUnitOccurenceList(
        maxArmy,
        location,
        context
      );
      this.ownershipClass = this.getOwnershipClass(location, context);
    });
    this.maxArmyService.requestState();
    this.gameContextService.requestState();
  }

  ngOnInit(): void {

  }

  getImagePath(unitType: UnitType): string {
    return getUnitImage(unitType);
  }

  private getOwnershipClass(fieldLocation: BoardLocation, gameContext: GameContext): string {
    const field = findByFieldLocation(fieldLocation, gameContext.game.fields);
    const owns = field.ownerId === gameContext.player.id;
    return owns ? 'owned' : 'enemy';
  }

  private convertToUnitOccurenceList(
    maxArmy: Army,
    fieldLocation: BoardLocation,
    context: GameContext
  ): Array<UnitOccurence> {
    const baseArmy = findByFieldLocation(
      fieldLocation,
      context.game.fields
    ).army || { droids: 0, tanks: 0, cannons: 0 };
    const frozenUnits = getFrozenUnitsAtLocation(
      fieldLocation,
      context.currentActions
    );
    const currentArmy = subtractArmies(baseArmy, frozenUnits);
    return [
      this.convertSingleToUnitOccurence(
        maxArmy.droids,
        currentArmy?.droids,
        'DROID'
      ),
      this.convertSingleToUnitOccurence(
        maxArmy.tanks,
        currentArmy?.tanks,
        'TANK'
      ),
      this.convertSingleToUnitOccurence(
        maxArmy.cannons,
        currentArmy?.cannons,
        'CANNON'
      ),
    ].filter((o) => o !== null);
  }

  private convertSingleToUnitOccurence(
    maxUnits: number,
    currentUnits: number,
    unitType: UnitType
  ): UnitOccurence | null {
    if (
      currentUnits === null ||
      currentUnits < 1 ||
      maxUnits === null ||
      maxUnits < 1
    ) {
      return null;
    }
    const ratio = currentUnits / maxUnits;
    const quartile = this.getQuartile(ratio);
    const quartileRangeLower = (quartile - 1) * 0.25;
    const distanceBetweenLowerAndUpper = 0.25;
    const distanceFromLower = ratio - quartileRangeLower;
    const quartileRangeRatio = distanceFromLower / distanceBetweenLowerAndUpper;
    const relativeAmount = quartileRangeRatio * 90;

    return {
      quartile,
      relativeAmount,
      unitType,
    };
  }

  private getQuartile(ratio: number): Quartile {
    if (ratio < 0.25) {
      return 1;
    }
    if (ratio < 0.5) {
      return 2;
    }
    if (ratio < 0.75) {
      return 3;
    }
    return 4;
  }

  @Input()
  set fieldLocation(location: BoardLocation) {
    this.fieldLocationSubject.next(location);
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
