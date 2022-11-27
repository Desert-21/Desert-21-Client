import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BuildingType } from 'src/app/models/game-models';
import { FieldSelection } from 'src/app/models/game-utility-models';
import { SelectedFieldService } from 'src/app/services/rx-logic/single-field-selection/selected-field.service';
import { getBuildingImage } from 'src/app/utils/building-utils';
import { underscoreToRegular } from 'src/app/utils/text-utils';

@Component({
  selector: 'app-building-preview',
  templateUrl: './building-preview.component.html',
  styleUrls: ['./building-preview.component.scss'],
})
export class BuildingPreviewComponent implements OnInit, OnDestroy {
  constructor(private selectedFieldService: SelectedFieldService) {}

  fieldSelectionEmpty = true;
  buildingName = 'Loading...';
  buildingDescription = '';
  buildingImage = 'assets/buildings/unknown-building.png';
  ownershipPrefix = '';
  isOwned = false;
  level: number | null = null;
  isEmpty = true;

  private sub1: Subscription;

  ngOnInit(): void {
    this.sub1 = this.selectedFieldService
      .getStateUpdates()
      .subscribe((selectedFieldInfo) => {
        if (selectedFieldInfo === null) {
          this.fieldSelectionEmpty = true;
          this.buildingName = '';
          this.buildingDescription = '';
          this.buildingImage = 'assets/buildings/unknown-building.png';
          this.ownershipPrefix = '';
          this.isOwned = false;
          this.level = null;
          this.isEmpty = true;
          return;
        }
        this.fieldSelectionEmpty = false;
        const selectedField = selectedFieldInfo.field;
        const building = selectedField.building;
        this.buildingName = underscoreToRegular(building.type);
        this.buildingDescription = this.getBuildingDescription(building.type);
        this.buildingImage = this.getBuildingImageSource(building.type);
        this.isOwned = selectedFieldInfo.isOwned;
        this.ownershipPrefix = this.getOwnershipPrefix(selectedFieldInfo);
        this.level = building?.level;
        this.isEmpty = building?.type === 'EMPTY_FIELD';
      });
    this.selectedFieldService.requestState();
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }

  private getOwnershipPrefix(selectedField: FieldSelection): string {
    if (selectedField.isOwned) {
      return 'Your';
    }
    if (selectedField.isEnemy) {
      return 'Enemy';
    }
    return 'Unoccupied';
  }

  private getBuildingDescription(type: string): string {
    switch (type) {
      case 'METAL_FACTORY':
        return 'These factories are producing metal, which can be used to create an army.';
      case 'BUILDING_MATERIALS_FACTORY':
        return 'These factories are producing building materials, which can be used to upgrade building and even build new ones.';
      case 'ELECTRICITY_FACTORY':
        return 'These factories are producing electricity, which can be used for a lab research or for firing rockets at opponent.';
      case 'TOWER':
        return 'Towers can be used to produce an army and they additionally offer some defending bonuses, making them much harder to conquer than regular buildings.';
      case 'HOME_BASE':
        return 'Home bases allow for producing army and offer protection for defenders just like towers do, but they also produce small fixed amount of metal, building materials and electricity.';
      case 'ROCKET_LAUNCHER':
        return 'Rocket launchers allow for firing rockets at opponent and causing serious damage to their army.';
      default:
        return 'Empty fields contain no buildings. They still produce very little amount of resources and after finishing some lab research, new buildings can be built there.';
    }
  }

  private getBuildingImageSource(type: string): string {
    return getBuildingImage(type as BuildingType, 1);
  }
}
