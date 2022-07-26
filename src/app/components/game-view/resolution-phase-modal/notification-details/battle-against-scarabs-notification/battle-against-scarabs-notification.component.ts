import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import {
  AppNotification,
  FieldConquestFullPictureNotification,
  FieldConquestNoInfoNotification,
} from 'src/app/models/notification-models';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import { ArmyDescription } from '../../../right-panel/army-preview/army-preview-state';

type AgainstScarabsBattleNotificationContent =
  | FieldConquestFullPictureNotification
  | FieldConquestNoInfoNotification;

type AgainstScarabsBattleNotificationType =
  | 'UNOCCUPIED_FIELD_ENEMY_CONQUEST_FAILED'
  | 'UNOCCUPIED_FIELD_PLAYERS_CONQUEST_FAILED'
  | 'UNOCCUPIED_FIELD_ENEMY_CONQUEST_SUCCEEDED'
  | 'UNOCCUPIED_FIELD_PLAYERS_CONQUEST_SUCCEEDED';

@Component({
  selector: 'app-battle-against-scarabs-notification',
  templateUrl: './battle-against-scarabs-notification.component.html',
  styleUrls: ['./battle-against-scarabs-notification.component.scss'],
})
export class BattleAgainstScarabsNotificationComponent
  implements OnInit, OnDestroy
{
  private notificationSubject = new BehaviorSubject<
    AppNotification<AgainstScarabsBattleNotificationContent>
  >(null);

  notificationTitle = '';

  attackersBefore: ArmyDescription = { droids: '?', tanks: '?', cannons: '?' };
  attackersDestroyed: ArmyDescription = {
    droids: '???',
    tanks: '???',
    cannons: '???',
  };
  scarabsBefore = '?';
  scarabsDestroyed = '???';

  sub1: Subscription;

  constructor(private gameContextService: GameContextService) {}

  ngOnInit(): void {
    this.sub1 = combineLatest([
      this.notificationSubject.asObservable(),
      this.gameContextService.getStateUpdates(),
    ]).subscribe(([notification, context]) => {
      this.notificationTitle = this.getNotificationTitle(
        notification.type as AgainstScarabsBattleNotificationType
      );
      const content = notification.content;
      this.enrichAttackersInfo(content);
      this.enrichScarabsInfo(content);
    });
    this.gameContextService.requestState();
  }

  private enrichScarabsInfo(
    content: AgainstScarabsBattleNotificationContent
  ): void {
    const castContent = content as FieldConquestFullPictureNotification;
    if (!castContent.defendersBefore || !castContent.defendersAfter) {
      this.scarabsBefore = '?';
      this.scarabsDestroyed = '- ???';
      return;
    }
    this.scarabsBefore = castContent.defendersBefore.scarabs.toString();
    this.scarabsDestroyed =
      castContent.defendersAfter.scarabs - castContent.defendersBefore.scarabs <
      0
        ? `${
            castContent.defendersAfter.scarabs -
            castContent.defendersBefore.scarabs
          }`
        : '';
  }

  private enrichAttackersInfo(
    content: AgainstScarabsBattleNotificationContent
  ): void {
    const castContent = content as FieldConquestFullPictureNotification;
    if (!castContent.attackersAfter || !castContent.attackersBefore) {
      this.attackersBefore = { droids: '?', tanks: '?', cannons: '?' };
      this.attackersDestroyed = {
        droids: '- ???',
        tanks: '- ???',
        cannons: '- ???',
      };
      return;
    }
    this.attackersBefore = {
      droids: castContent.attackersBefore.droids.toString(),
      tanks: castContent.attackersBefore.tanks.toString(),
      cannons: castContent.attackersBefore.cannons.toString(),
    };
    this.attackersDestroyed = {
      droids: `${
        castContent.attackersAfter.droids -
          castContent.attackersBefore.droids !==
        0
          ? castContent.attackersAfter.droids -
            castContent.attackersBefore.droids
          : ''
      }`,
      tanks: `${
        castContent.attackersAfter.tanks - castContent.attackersBefore.tanks !==
        0
          ? castContent.attackersAfter.tanks - castContent.attackersBefore.tanks
          : ''
      }`,
      cannons: `${
        castContent.attackersAfter.cannons -
          castContent.attackersBefore.cannons !==
        0
          ? castContent.attackersAfter.cannons -
            castContent.attackersBefore.cannons
          : ''
      }`,
    };
  }

  private getNotificationTitle(
    notificationType: AgainstScarabsBattleNotificationType
  ): string {
    switch (notificationType) {
      case 'UNOCCUPIED_FIELD_ENEMY_CONQUEST_FAILED':
        return 'Opponent failed to conquer unoccupied field';
      case 'UNOCCUPIED_FIELD_ENEMY_CONQUEST_SUCCEEDED':
        return 'Opponent has conquered an unoccupied field';
      case 'UNOCCUPIED_FIELD_PLAYERS_CONQUEST_FAILED':
        return 'You failed to conquer an unoccupied field';
      case 'UNOCCUPIED_FIELD_PLAYERS_CONQUEST_SUCCEEDED':
        return 'You have conquered an unoccupied field';
    }
  }

  get notification(): AppNotification<AgainstScarabsBattleNotificationContent> {
    return this.notificationSubject.getValue();
  }

  @Input()
  set notification(
    notification: AppNotification<AgainstScarabsBattleNotificationContent>
  ) {
    this.notificationSubject.next(notification);
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
