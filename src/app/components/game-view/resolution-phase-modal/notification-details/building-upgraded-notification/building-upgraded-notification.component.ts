import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { BuildingUpgradedNotification } from 'src/app/models/notification-models';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import { getBuildingImage } from 'src/app/utils/building-utils';
import { findByFieldLocation } from 'src/app/utils/location-utils';
import { underscoreToRegular } from 'src/app/utils/text-utils';

@Component({
  selector: 'app-building-upgraded-notification',
  templateUrl: './building-upgraded-notification.component.html',
  styleUrls: ['./building-upgraded-notification.component.scss'],
})
export class BuildingUpgradedNotificationComponent implements OnInit, OnDestroy {
  private notificationSubject =
    new BehaviorSubject<BuildingUpgradedNotification>(null);
  sourceFrom = '';
  sourceTo = '';
  levelFrom = 1;
  levelTo = 2;
  isPlayerWhoUpgraded = true;
  buildingName = '';

  sub1: Subscription;

  constructor(private gameContextService: GameContextService) {}

  ngOnInit(): void {
    this.sub1 = combineLatest([
      this.notificationSubject.asObservable(),
      this.gameContextService.getStateUpdates(),
    ]).subscribe(([notification, context]) => {
      const location = notification.location;
      const field = findByFieldLocation(location, context.game.fields);
      this.isPlayerWhoUpgraded = field.ownerId === context.player.id;
      this.sourceFrom = getBuildingImage(
        field.building.type,
        notification.fromLevel
      );
      this.sourceTo = getBuildingImage(
        field.building.type,
        notification.toLevel
      );
      this.levelFrom = notification.fromLevel;
      this.levelTo = notification.toLevel;
      this.buildingName = underscoreToRegular(field.building.type);
    });
    this.gameContextService.requestState();
  }

  get notification(): BuildingUpgradedNotification {
    return this.notificationSubject.getValue();
  }

  @Input()
  set notification(notification: BuildingUpgradedNotification) {
    this.notificationSubject.next(notification);
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
