import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BuildingType } from 'src/app/models/game-models';
import { CurrentlyBuiltBuildingService } from 'src/app/services/rx-logic/single-field-selection/currently-built-building.service';

@Component({
  selector: 'app-building-queue',
  templateUrl: './building-queue.component.html',
  styleUrls: ['./building-queue.component.scss'],
})
export class BuildingQueueComponent implements OnInit, OnDestroy {
  shouldShowTheQueue = false;

  imageSource = '/assets/metal.png';

  private sub1: Subscription;

  constructor(
    private currentlyBuiltBuildingService: CurrentlyBuiltBuildingService
  ) {}

  ngOnInit(): void {
    this.sub1 = this.currentlyBuiltBuildingService
      .getStateUpdates()
      .subscribe((resp) => {
        this.shouldShowTheQueue = resp !== null;
        this.imageSource = this.getImageSource(resp);
      });
    this.currentlyBuiltBuildingService.requestState();
  }

  private getImageSource(buildingType: BuildingType): string {
    const base = '/assets/';
    switch (buildingType) {
      case 'METAL_FACTORY':
        return `${base}metal.png`;
      case 'BUILDING_MATERIALS_FACTORY':
        return `${base}buildingMaterials.png`;
      case 'ELECTRICITY_FACTORY':
        return `${base}electricity.png`;
      case 'TOWER':
        return `${base}tower.png`;
      default: return '';
    }
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
