import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { Field } from 'src/app/models/game-models';
import { GameStateService } from 'src/app/services/http/game-state.service';
import { UserInfoService } from 'src/app/services/http/user-info.service';
import { LocationSelectionService } from 'src/app/services/rx-logic/location-selection.service';
import { SelectedFieldService } from 'src/app/services/rx-logic/selected-field.service';
import { findByFieldLocation } from 'src/app/utils/location-utils';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
})
export class FieldComponent implements OnInit, OnDestroy {
  constructor(
    private gameStateService: GameStateService,
    private userInfoService: UserInfoService,
    private selectedFieldService: SelectedFieldService,
    private selectedLocationService: LocationSelectionService
  ) {}

  @Input() row = -1;
  @Input() col = -1;

  @Input() field: Field;
  fields: Array<Array<Field>> = [[]];

  currentClasses = '';

  usersId = '';

  isSelected = false;

  private sub1: Subscription;
  private sub2: Subscription;

  ngOnInit(): void {
    this.sub1 = combineLatest([
      this.gameStateService.getStateUpdates(),
      this.userInfoService.getStateUpdates(),
    ]).subscribe((gameWithUsersData) => {
      const game = gameWithUsersData[0];
      const usersData = gameWithUsersData[1];
      this.usersId = usersData.id;
      this.fields = game.fields;
      this.field = game?.fields[this.row][this.col];
      this.currentClasses = this.getStyling();
    });
    this.sub2 = this.selectedFieldService.getStateUpdates().subscribe((field) => {
      if (field === null) {
        this.isSelected = false;
      } else {
        this.isSelected = this.row === field.row && this.col === field.col;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

  getStyling(): string {
    const ownerId = this.field?.ownerId;
    const isOwned = ownerId === this.usersId;
    if (ownerId === null) {
      return '';
    }

    let suffix;
    if (isOwned) {
      suffix = 'friendly';
    } else {
      suffix = 'enemy';
    }
    const classes = this.getBorderClassParts(ownerId);
    const fullClasses = classes
      .filter((c) => c !== '')
      .map((c) => `${c}-${suffix}`);
    return fullClasses.reduce((prev, next) => {
      return prev + ' ' + next;
    }, '');
  }

  getBorderClassParts(ownerId: string): Array<string> {
    const classes = [
      this.getClassIfFieldBelongsTo(
        'top',
        findByFieldLocation({ row: this.row - 1, col: this.col }, this.fields)
      ),
      this.getClassIfFieldBelongsTo(
        'bottom',
        findByFieldLocation({ row: this.row + 1, col: this.col }, this.fields)
      ),
      this.getClassIfFieldBelongsTo(
        'left',
        findByFieldLocation({ row: this.row, col: this.col - 1 }, this.fields)
      ),
      this.getClassIfFieldBelongsTo(
        'right',
        findByFieldLocation({ row: this.row, col: this.col + 1 }, this.fields)
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

  fieldToImagePath(field: Field): string {
    const type = field?.building?.type;
    switch (type) {
      case 'METAL_FACTORY':
        return '/assets/metal.png';
      case 'BUILDING_MATERIALS_FACTORY':
        return '/assets/buildingMaterials.png';
      case 'ELECTRICITY_FACTORY':
        return '/assets/electricity.png';
      case 'HOME_BASE':
        return '/assets/home.png';
      case 'ROCKET_LAUNCHER':
        return '/assets/rocket.png';
      case 'TOWER':
        return '/assets/tower.png';
    }
    return '/assets/blank.png';
  }

  onFieldSelect(): void {
    if (this.selectedLocationService.isCurrentSelection(this.row, this.col)) {
      this.selectedLocationService.setLocation(null);
    } else {
      this.selectedLocationService.setLocation({
        row: this.row,
        col: this.col,
      });
    }
  }
}
