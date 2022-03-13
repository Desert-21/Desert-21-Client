import { Component, Input, OnInit } from '@angular/core';
import { combineLatestWith } from 'rxjs';
import { Field } from 'src/app/models/game-models';
import { GameStateService } from 'src/app/services/http/game-state.service';
import { SelectedFieldService } from 'src/app/services/selected-field.service';
import { UserInfoService } from 'src/app/services/http/user-info.service';
import { findByFieldLocation } from 'src/app/utils/location-utils';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
})
export class FieldComponent implements OnInit {
  constructor(
    private gameStateService: GameStateService,
    private userInfoService: UserInfoService,
    private selectedFieldService: SelectedFieldService
  ) {}

  @Input() row: number = -1;
  @Input() col: number = -1;

  @Input() field: Field;
  fields: Array<Array<Field>> = [[]];

  currentClasses: string = '';

  usersId: string = '';

  isSelected: boolean = false;

  ngOnInit(): void {
    this.gameStateService
      .getStateUpdates()
      .pipe(combineLatestWith(this.userInfoService.getStateUpdates()))
      .subscribe((gameWithUsersData) => {
        const game = gameWithUsersData[0];
        const usersData = gameWithUsersData[1];
        this.usersId = usersData.id;
        this.fields = game.fields;
        this.field = game?.fields[this.row][this.col];
        this.currentClasses = this.getStyling();
      });
    this.selectedFieldService.getSelectedFieldUpdates().subscribe(field => {
      this.isSelected = this.row === field.row && this.col === field.col
    });
  }

  getStyling() {
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

  getBorderClassParts(ownerId: string) {
    const classes = [
      this.getClassIfFieldBelongsTo(
        'top',
        findByFieldLocation(this.row - 1, this.col, this.fields)
      ),
      this.getClassIfFieldBelongsTo(
        'bottom',
        findByFieldLocation(this.row + 1, this.col, this.fields)
      ),
      this.getClassIfFieldBelongsTo(
        'left',
        findByFieldLocation(this.row, this.col - 1, this.fields)
      ),
      this.getClassIfFieldBelongsTo(
        'right',
        findByFieldLocation(this.row, this.col + 1, this.fields)
      ),
    ];
    return classes;
  }

  getClassIfFieldBelongsTo(className: string, field: Field) {
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
    let type = field?.building?.type;
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

  onFieldSelect() {
    if (this.selectedFieldService.isCurrentSelection(this.row, this.col)) {
      this.selectedFieldService.clearSelection();
    } else {
      this.selectedFieldService.setField(this.row, this.col);
    }
  }
}
