import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BuildingType } from 'src/app/models/game-models';
import { CurrentlyBuiltBuildingService } from 'src/app/services/rx-logic/single-field-selection/currently-built-building.service';
import { getBuildingImage } from 'src/app/utils/building-utils';

@Component({
  selector: 'app-building-queue',
  templateUrl: './building-queue.component.html',
  styleUrls: ['./building-queue.component.scss'],
})
export class BuildingQueueComponent implements OnInit, OnDestroy {
  shouldShowTheQueue = false;

  imageSource = '/assets/resources/metal.png';

  private sub1: Subscription;

  constructor(
    private currentlyBuiltBuildingService: CurrentlyBuiltBuildingService
  ) {}

  ngOnInit(): void {
    this.sub1 = this.currentlyBuiltBuildingService
      .getStateUpdates()
      .subscribe((resp) => {
        this.shouldShowTheQueue = resp !== null;
        this.imageSource = getBuildingImage(resp, 1);
      });
    this.currentlyBuiltBuildingService.requestState();
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
