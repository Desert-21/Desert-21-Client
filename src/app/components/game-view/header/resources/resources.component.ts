import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { ResourceSet } from 'src/app/models/game-models';
import { GameStateService } from 'src/app/services/http/game-state.service';
import { UserInfoService } from 'src/app/services/http/user-info.service';
import { AvailableResourcesService } from 'src/app/services/rx-logic/shared/available-resources.service';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import { NextTurnResourcesService } from 'src/app/services/rx-logic/shared/next-turn-resources.service';

type ResourceDescription = {
  availableAmount: string;
  description: string;
  imageSource: string;
  nextTurnAmount: string;
};

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
})
export class ResourcesComponent implements OnInit, OnDestroy {
  constructor(
    private availableResourcesService: AvailableResourcesService,
    private nextTurnResourceService: NextTurnResourcesService
  ) {}

  userId: string = null;
  resourceDescriptions: Array<ResourceDescription> = [
    {
      availableAmount: '???',
      description:
        'Metal is used to build your army. The more you have, the more units you are able to produce!',
      imageSource: '/assets/resources/metal.png',
      nextTurnAmount: '???',
    },
    {
      availableAmount: '???',
      description:
        'Building materials are used to upgrade your buildings and make them produce more resources, train more types of units and more!',
      imageSource: '/assets/resources/building-materials.png',
      nextTurnAmount: '???',
    },
    {
      availableAmount: '???',
      description:
        'Electricity is a resource used in the lab to give you overall extra bonuses. It may be also used to fire rocket strikes at your opponents!',
      imageSource: '/assets/resources/electricity.png',
      nextTurnAmount: '???',
    },
  ];

  resourceSet: ResourceSet = {
    metal: null,
    buildingMaterials: null,
    electricity: null,
  };

  private sub1: Subscription;

  ngOnInit(): void {
    this.sub1 = combineLatest([
      this.availableResourcesService.getStateUpdates(),
      this.nextTurnResourceService.getStateUpdates(),
    ]).subscribe(([availableResources, nextTurnResources]) => {
      this.resourceDescriptions = this.processResourceSets(availableResources, nextTurnResources);
    });
    this.availableResourcesService.requestState();
    this.nextTurnResourceService.requestState();
  }

  private processResourceSets(
    availableResources: ResourceSet,
    nextTurnResources: ResourceSet
  ): Array<ResourceDescription> {
    return [
      {
        availableAmount: availableResources?.metal?.toString() || '???',
        description:
          'Metal is used to build your army. The more you have, the more units you are able to produce!',
        imageSource: '/assets/resources/metal.png',
        nextTurnAmount: nextTurnResources?.metal?.toString() || '???',
      },
      {
        availableAmount: availableResources?.buildingMaterials?.toString() || '???',
        description:
          'Building materials are used to upgrade your buildings and make them produce more resources, train more types of units and more!',
        imageSource: '/assets/resources/building-materials.png',
        nextTurnAmount: nextTurnResources?.buildingMaterials?.toString() || '???',
      },
      {
        availableAmount: availableResources.electricity?.toString() || '???',
        description:
          'Electricity is a resource used in the lab to give you overall extra bonuses. It may be also used to fire rocket strikes at your opponents!',
        imageSource: '/assets/resources/electricity.png',
        nextTurnAmount: nextTurnResources.electricity?.toString() || '???',
      },
    ];
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
