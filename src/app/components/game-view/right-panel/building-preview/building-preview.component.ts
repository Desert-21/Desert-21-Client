import { Component, OnInit } from '@angular/core';
import { combineLatestWith } from 'rxjs';
import { FieldSelection } from 'src/app/models/game-utility-models';
import { UsersData } from 'src/app/models/profile-models.';
import { GameStateService } from 'src/app/services/http/game-state.service';
import { UserInfoService } from 'src/app/services/http/user-info.service';
import { SelectedFieldService } from 'src/app/services/selected-field.service';
import { underscoreToRegular } from 'src/app/utils/text-utils';

@Component({
  selector: 'app-building-preview',
  templateUrl: './building-preview.component.html',
  styleUrls: ['./building-preview.component.scss'],
})
export class BuildingPreviewComponent implements OnInit {
  constructor(
    private gameStateService: GameStateService,
    private userInfoService: UserInfoService,
    private selectedFieldService: SelectedFieldService
  ) {}

  buildingName = 'Loading...';
  buildingDescription = '';
  buildingImage = 'assets/buildings/unknownBuilding.png';
  ownershipPrefix = '';
  level: number | null = null;
  isEmpty = true;

  ngOnInit(): void {
    this.gameStateService
      .getStateUpdates()
      .pipe(
        combineLatestWith(
          this.userInfoService.getStateUpdates(),
          this.selectedFieldService.getSelectedFieldUpdates()
        )
      )
      .subscribe((gameStateWithUserInfo) => {
        const gameState = gameStateWithUserInfo[0];
        const userInfo = gameStateWithUserInfo[1];
        const selectedField = gameStateWithUserInfo[2];

        const building = selectedField.field.building;
        this.buildingName = underscoreToRegular(building.type);
        this.buildingDescription = this.getBuildingDescription(building.type);
        this.buildingImage = this.getBuildingImageSource(building.type);
        this.ownershipPrefix = this.getOwnershipPrefix(userInfo, selectedField);
        this.level = building?.level;
        this.isEmpty = building?.type === 'EMPTY_FIELD';
      });
    this.gameStateService.requestState();
    this.userInfoService.requestState();
  }

  private getOwnershipPrefix(userInfo: UsersData, selectedField: FieldSelection): string {
    const ownerId = selectedField.field.ownerId;
    if (ownerId === null) {
      return 'Unoccupied';
    }
    const id = userInfo.id;
    if (ownerId === id) {
      return 'Your';
    }
    return 'Enemy';
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
        return 'Rocket launchers allow for firing rockets at opponent and cousing serious damage to their army.';
      default:
        return 'Empty fields contain no buildings. They still produce very little amount of resources and after finishing some lab research, new buildings can be built there.';
    }
  }

  private getBuildingImageSource(type: string): string {
    switch (type) {
      case 'METAL_FACTORY':
        return 'assets/buildings/metal.png';
      case 'BUILDING_MATERIALS_FACTORY':
        return 'assets/buildings/buildingMaterials.png';
      case 'ELECTRICITY_FACTORY':
        return 'assets/buildings/electricity.png';
      case 'TOWER':
        return 'assets/buildings/tower.png';
      case 'HOME_BASE':
       return 'assets/buildings/tower.png';
      case 'ROCKET_LAUNCHER':
        return 'assets/buildings/rocket.png';
      default:
        return 'assets/buildings/unknownBuilding.png';
    }
  }
}
