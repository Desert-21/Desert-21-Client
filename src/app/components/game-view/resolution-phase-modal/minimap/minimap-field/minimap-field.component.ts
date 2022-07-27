import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { BoardLocation, Field } from 'src/app/models/game-models';
import { MinimapSelectedLocationService } from 'src/app/services/rx-logic/resolution-phase/minimap-selected-location.service';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import {
  areLocationsEqual,
  findByFieldLocation,
} from 'src/app/utils/location-utils';

@Component({
  selector: 'app-minimap-field',
  templateUrl: './minimap-field.component.html',
  styleUrls: ['./minimap-field.component.scss'],
})
export class MinimapFieldComponent implements OnInit, OnDestroy {
  private locationSubject = new BehaviorSubject<BoardLocation>({
    row: 0,
    col: 0,
  });

  field: Field = null;
  fields: Array<Array<Field>> = [];

  currentClasses = '';

  sub1: Subscription;

  constructor(
    private gameContextService: GameContextService,
    private minimapSelectedLocationService: MinimapSelectedLocationService
  ) {}

  ngOnInit(): void {
    this.sub1 = combineLatest([
      this.locationSubject.asObservable(),
      this.gameContextService.getStateUpdates(),
      this.minimapSelectedLocationService.getStateUpdates(),
    ]).subscribe(([location, context, selectedLocation]) => {
      this.field = findByFieldLocation(location, context.game.fields);
      this.fields = context.game.fields;
      const borderClasses = this.getBorderStyling(context.player.id);
      this.currentClasses = this.optionallyAppendSelectedLocationStyling(
        borderClasses,
        selectedLocation
      );
    });
    this.gameContextService.requestState();
    this.minimapSelectedLocationService.requestState();
  }

  optionallyAppendSelectedLocationStyling(
    currentClasses: string,
    selectedLocation: BoardLocation
  ): string {
    if (!areLocationsEqual(this.location, selectedLocation)) {
      return currentClasses;
    }
    return `${currentClasses} selected-field`;
  }

  getBorderStyling(usersId: string): string {
    const ownerId = this.field?.ownerId;
    const isOwned = ownerId === usersId;
    if (ownerId === null) {
      return '';
    }

    let suffix;
    if (isOwned) {
      suffix = 'friendly';
    } else {
      suffix = 'enemy';
    }
    const classes = this.getBorderClassParts();
    const fullClasses = classes
      .filter((c) => c !== '')
      .map((c) => `${c}-${suffix}`);
    return fullClasses.reduce((prev, next) => {
      return prev + ' ' + next;
    }, '');
  }

  getBorderClassParts(): Array<string> {
    const { row, col } = this.location;
    const classes = [
      this.getClassIfFieldBelongsTo(
        'top',
        findByFieldLocation({ row: row - 1, col }, this.fields)
      ),
      this.getClassIfFieldBelongsTo(
        'bottom',
        findByFieldLocation({ row: row + 1, col }, this.fields)
      ),
      this.getClassIfFieldBelongsTo(
        'left',
        findByFieldLocation({ row, col: col - 1 }, this.fields)
      ),
      this.getClassIfFieldBelongsTo(
        'right',
        findByFieldLocation({ row, col: col + 1 }, this.fields)
      ),
    ];
    return classes;
  }

  getClassIfFieldBelongsTo(className: string, field: Field): string {
    const ownerId = this.field?.ownerId;
    if (field === null) {
      return className;
    }
    if (field.ownerId !== ownerId) {
      return className;
    }
    return '';
  }

  get location(): BoardLocation {
    return this.locationSubject.getValue();
  }

  @Input()
  set location(location: BoardLocation) {
    this.locationSubject.next(location);
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
