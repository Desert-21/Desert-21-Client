import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResourceSet } from 'src/app/models/game-models';
import { GameStateService } from 'src/app/services/http/game-state.service';
import { UserInfoService } from 'src/app/services/http/user-info.service';
import { AvailableResourcesService } from 'src/app/services/rx-logic/available-resources.service';
import { GameContextService } from 'src/app/services/rx-logic/game-context.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
})
export class ResourcesComponent implements OnInit, OnDestroy {
  constructor(private availableResourcesService: AvailableResourcesService) {}

  userId: string = null;
  resourceSet: ResourceSet = {
    metal: null,
    buildingMaterials: null,
    electricity: null,
  };

  private sub1: Subscription;

  ngOnInit(): void {
    this.sub1 = this.availableResourcesService
      .getStateUpdates()
      .subscribe((resourceSet) => {
        this.resourceSet = resourceSet;
      });
    this.availableResourcesService.requestState();
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
