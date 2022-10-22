import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResourceSet } from 'src/app/models/game-models';
import { GameStateService } from 'src/app/services/http/game-state.service';
import { UserInfoService } from 'src/app/services/http/user-info.service';
import { AvailableResourcesService } from 'src/app/services/rx-logic/shared/available-resources.service';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import { NextTurnResourcesService } from 'src/app/services/rx-logic/shared/next-turn-resources.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
})
export class ResourcesComponent implements OnInit, OnDestroy {
  constructor(
    private availableResourcesService: AvailableResourcesService,
    private nextTurnResources: NextTurnResourcesService
  ) {}

  userId: string = null;
  resourceSet: ResourceSet = {
    metal: null,
    buildingMaterials: null,
    electricity: null,
  };

  private sub1: Subscription;
  private sub2: Subscription;

  ngOnInit(): void {
    this.sub1 = this.availableResourcesService
      .getStateUpdates()
      .subscribe((resourceSet) => {
        this.resourceSet = resourceSet;
      });
    this.sub2 = this.nextTurnResources
      .getStateUpdates()
      .subscribe((nextResourceSet) => {
        console.log(nextResourceSet);
      });
    this.availableResourcesService.requestState();
    this.nextTurnResources.requestState();
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }
}
