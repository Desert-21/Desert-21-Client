import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { Field } from 'src/app/models/game-models';
import { OwnershipType } from 'src/app/models/game-utility-models';
import { RocketStrikeDestroysRocketLauncherNotification } from 'src/app/models/notification-models';
import { MinimapSelectedLocationService } from 'src/app/services/rx-logic/resolution-phase/minimap-selected-location.service';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import { findByFieldLocation } from 'src/app/utils/location-utils';

@Component({
  selector: 'app-rocket-strike-on-rocket-notification',
  templateUrl: './rocket-strike-on-rocket-notification.component.html',
  styleUrls: ['./rocket-strike-on-rocket-notification.component.scss'],
})
export class RocketStrikeOnRocketNotificationComponent implements OnInit {
  notificationSubject =
    new BehaviorSubject<RocketStrikeDestroysRocketLauncherNotification>(null);

  ownershipType: OwnershipType = 'UNOCCUPIED';

  sub1: Subscription;

  constructor(
    private gameContextService: GameContextService,
    private minimapLocationService: MinimapSelectedLocationService
  ) {}

  ngOnInit(): void {
    this.sub1 = combineLatest([
      this.notificationSubject.asObservable(),
      this.gameContextService.getStateUpdates(),
    ]).subscribe(([notification, context]) => {
      this.minimapLocationService.set(notification.location);
      const field = findByFieldLocation(
        notification.location,
        context.game.fields
      );
      this.ownershipType = this.getOwnershipType(
        field.ownerId,
        context.player.id
      );
    });
    this.gameContextService.requestState();
  }

  private getOwnershipType(
    ownerId: string | null,
    playersId: string
  ): OwnershipType {
    if (ownerId === null) {
      return 'UNOCCUPIED';
    }
    if (ownerId === playersId) {
      return 'OWNED';
    }
    return 'ENEMY';
  }

  get notification(): RocketStrikeDestroysRocketLauncherNotification {
    return this.notificationSubject.getValue();
  }

  @Input()
  set notification(
    notification: RocketStrikeDestroysRocketLauncherNotification
  ) {
    this.notificationSubject.next(notification);
  }
}
