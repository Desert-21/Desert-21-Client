import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { ResourceSet } from 'src/app/models/game-models';
import {
  AppNotification,
  ResourcesProducedNotification,
} from 'src/app/models/notification-models';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';

@Component({
  selector: 'app-resources-produced-notification',
  templateUrl: './resources-produced-notification.component.html',
  styleUrls: ['./resources-produced-notification.component.scss'],
})
export class ResourcesProducedNotificationComponent
  implements OnInit, OnDestroy
{
  private notificationSubject =
    new BehaviorSubject<ResourcesProducedNotification>(null);

  resources: ResourceSet = { metal: 0, buildingMaterials: 0, electricity: 0 };
  isPlayerProducer = true;

  sub1: Subscription;

  constructor(private gameContextService: GameContextService) {}

  ngOnInit(): void {
    this.sub1 = combineLatest([
      this.notificationSubject.asObservable(),
      this.gameContextService.getStateUpdates(),
    ]).subscribe(([notification, context]) => {
      this.isPlayerProducer = notification.playerId === context.player.id;
      this.resources = notification.produced;
    });
    this.gameContextService.requestState();
  }

  get notification(): ResourcesProducedNotification {
    return this.notificationSubject.getValue();
  }

  @Input()
  set notification(notification: ResourcesProducedNotification) {
    this.notificationSubject.next(notification);
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
