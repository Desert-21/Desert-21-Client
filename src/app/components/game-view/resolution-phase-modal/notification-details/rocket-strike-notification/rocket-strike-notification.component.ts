import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { Army } from 'src/app/models/game-models';
import { RocketStrikeNotification } from 'src/app/models/notification-models';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import { findByFieldLocation } from 'src/app/utils/location-utils';

@Component({
  selector: 'app-rocket-strike-notification',
  templateUrl: './rocket-strike-notification.component.html',
  styleUrls: ['./rocket-strike-notification.component.scss'],
})
export class RocketStrikeNotificationComponent implements OnInit, OnDestroy {
  private notificationSubject = new BehaviorSubject<RocketStrikeNotification>(
    null
  );

  isPlayerFieldOwner = true;
  armyBefore: Army = { droids: 0, tanks: 0, cannons: 0 };
  armyDestroyed: Army = { droids: 0, tanks: 0, cannons: 0 };

  sub1: Subscription;

  constructor(private gameContextService: GameContextService) {}

  ngOnInit(): void {
    this.sub1 = combineLatest([
      this.notificationSubject.asObservable(),
      this.gameContextService.getStateUpdates(),
    ]).subscribe(([notification, context]) => {
      this.armyBefore = notification.defendersBefore;
      this.armyDestroyed = {
        droids:
          notification.defendersAfter.droids -
          notification.defendersBefore.droids,
        tanks:
          notification.defendersAfter.tanks -
          notification.defendersBefore.tanks,
        cannons:
          notification.defendersAfter.cannons -
          notification.defendersBefore.cannons,
      };
      const field = findByFieldLocation(notification.location, context.game.fields);
      this.isPlayerFieldOwner = field.ownerId === context.player.id;
    });
    this.gameContextService.requestState();
  }

  get notification(): RocketStrikeNotification {
    return this.notificationSubject.getValue();
  }

  @Input()
  set notification(notification: RocketStrikeNotification) {
    this.notificationSubject.next(notification);
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
