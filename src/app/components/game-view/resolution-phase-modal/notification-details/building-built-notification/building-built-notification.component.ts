import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import {
  BuildingBuiltNotification,
  UnitsTrainedNotification,
} from 'src/app/models/notification-models';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import { getUnitImage } from 'src/app/utils/army-utils';
import { getBuildingImage } from 'src/app/utils/building-utils';
import { findByFieldLocation } from 'src/app/utils/location-utils';
import { underscoreToRegular } from 'src/app/utils/text-utils';

@Component({
  selector: 'app-building-built-notification',
  templateUrl: './building-built-notification.component.html',
  styleUrls: ['./building-built-notification.component.scss'],
})
export class BuildingBuiltNotificationComponent implements OnInit, OnDestroy {
  private notificationSubject = new BehaviorSubject<BuildingBuiltNotification>(
    null
  );

  isPlayerWhoHasBuilt = true;
  buildingName = '';
  imageSource = '';

  sub1: Subscription;

  constructor(private gameContextService: GameContextService) {}

  ngOnInit(): void {
    this.sub1 = combineLatest([
      this.notificationSubject.asObservable(),
      this.gameContextService.getStateUpdates(),
    ]).subscribe(([notification, context]) => {
      this.imageSource = getBuildingImage(notification.buildingType, 1);
      const field = findByFieldLocation(notification.location, context.game.fields);
      this.isPlayerWhoHasBuilt = field.ownerId === context.player.id;
      this.buildingName = underscoreToRegular(notification.buildingType);
    });
    this.gameContextService.requestState();
  }

  get notification(): BuildingBuiltNotification {
    return this.notificationSubject.getValue();
  }

  @Input()
  set notification(notification: BuildingBuiltNotification) {
    this.notificationSubject.next(notification);
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
