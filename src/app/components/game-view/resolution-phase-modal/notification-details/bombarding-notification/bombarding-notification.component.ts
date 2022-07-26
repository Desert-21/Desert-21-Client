import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import {
  AppNotification,
  FieldConquestAttackerOnlyNotification,
  FieldConquestFullPictureNotification,
} from 'src/app/models/notification-models';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import { ArmyDescription } from '../../../right-panel/army-preview/army-preview-state';

type BombardingNotificationContent =
  | FieldConquestAttackerOnlyNotification
  | FieldConquestFullPictureNotification;

type BombardingNotificationType =
  | 'PLAYER_BOMBARDING_SUCCEEDED'
  | 'ENEMY_BOMBARDING_SUCCEEDED'
  | 'PLAYER_BOMBARDING_FAILED'
  | 'ENEMY_BOMBARDING_FAILED';

@Component({
  selector: 'app-bombarding-notification',
  templateUrl: './bombarding-notification.component.html',
  styleUrls: ['./bombarding-notification.component.scss'],
})
export class BombardingNotificationComponent implements OnInit, OnDestroy {
  notificationSubject = new BehaviorSubject<
    AppNotification<BombardingNotificationContent>
  >(null);

  notificationTitle = '';
  cannonsAmount = 0;
  defendersBefore: ArmyDescription = { droids: '?', tanks: '?', cannons: '?' };
  defendersDestroyed: ArmyDescription = {
    droids: '?',
    tanks: '?',
    cannons: '?',
  };

  sub1: Subscription;

  constructor(private gameContextService: GameContextService) {}

  ngOnInit(): void {
    this.sub1 = combineLatest([
      this.notificationSubject.asObservable(),
      this.gameContextService.getStateUpdates(),
    ]).subscribe(([notification, context]) => {
      const type = notification.type as BombardingNotificationType;
      this.notificationTitle = this.getNotificationMessage(type);
      const content = notification.content;
      this.cannonsAmount = content.attackersBefore.cannons;
      this.enrichDefendersInfo(notification.content);
    });
    this.gameContextService.requestState();
  }

  private enrichDefendersInfo(content: BombardingNotificationContent): void {
    const castContent = content as FieldConquestFullPictureNotification;
    if (!castContent.defendersAfter || !castContent.defendersBefore) {
      this.defendersBefore = { droids: '?', tanks: '?', cannons: '?' };
      this.defendersDestroyed = {
        droids: '- ???',
        tanks: '- ???',
        cannons: '- ???',
      };
      return;
    }
    this.defendersBefore = {
      droids: castContent.defendersBefore.droids.toString(),
      tanks: castContent.defendersBefore.tanks.toString(),
      cannons: castContent.defendersBefore.cannons.toString(),
    };
    this.defendersDestroyed = {
      droids: `${
        castContent.defendersAfter.droids -
          castContent.defendersBefore.droids !==
        0
          ? castContent.defendersAfter.droids -
            castContent.defendersBefore.droids
          : ''
      }`,
      tanks: `${
        castContent.defendersAfter.tanks - castContent.defendersBefore.tanks !==
        0
          ? castContent.defendersAfter.tanks - castContent.defendersBefore.tanks
          : ''
      }`,
      cannons: `${
        castContent.defendersAfter.cannons -
          castContent.defendersBefore.cannons !==
        0
          ? castContent.defendersAfter.cannons -
            castContent.defendersBefore.cannons
          : ''
      }`,
    };
  }

  private getNotificationMessage(
    notificationType: BombardingNotificationType
  ): string {
    switch (notificationType) {
      case 'ENEMY_BOMBARDING_FAILED':
      case 'ENEMY_BOMBARDING_SUCCEEDED':
        return 'Opponent has bombarded your field';
      case 'PLAYER_BOMBARDING_FAILED':
      case 'PLAYER_BOMBARDING_SUCCEEDED':
        return 'You have bombarded opponents field';
    }
  }

  get notification(): AppNotification<BombardingNotificationContent> {
    return this.notificationSubject.getValue();
  }

  @Input()
  set notification(
    notification: AppNotification<BombardingNotificationContent>
  ) {
    this.notificationSubject.next(notification);
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
