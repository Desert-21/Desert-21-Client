import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import {
  AppNotification,
  FieldConquestFullPictureNotification,
  FieldConquestNoInfoNotification,
} from 'src/app/models/notification-models';
import { MinimapSelectedLocationService } from 'src/app/services/rx-logic/resolution-phase/minimap-selected-location.service';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import {
  armyToArmyDescription,
  getArmyDamageDescription,
  getUnitDamageDescription,
} from 'src/app/utils/army-utils';
import { ArmyDescription } from '../../../right-panel/army-preview/army-preview-state';

type AgainstScarabsBattleNotificationContent =
  | FieldConquestFullPictureNotification
  | FieldConquestNoInfoNotification;

type AgainstScarabsBattleNotificationType =
  | 'UNOCCUPIED_FIELD_ENEMY_CONQUEST_FAILED'
  | 'UNOCCUPIED_FIELD_PLAYERS_CONQUEST_FAILED'
  | 'UNOCCUPIED_FIELD_ENEMY_CONQUEST_SUCCEEDED'
  | 'UNOCCUPIED_FIELD_PLAYERS_CONQUEST_SUCCEEDED';

const defaultAttackersDestroyed: ArmyDescription = {
  droids: '???',
  tanks: '???',
  cannons: '???',
};

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
  attackersDestroyed: ArmyDescription = defaultAttackersDestroyed;
  scarabsBefore = '?';
  scarabsDestroyed = '???';

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
      this.minimapLocationService.set(notification.content.location);
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
    this.scarabsDestroyed = getUnitDamageDescription(
      castContent.defendersBefore.scarabs,
      castContent.defendersAfter.scarabs
    );
  }

  private enrichAttackersInfo(
    content: AgainstScarabsBattleNotificationContent
  ): void {
    const castContent = content as FieldConquestFullPictureNotification;
    if (!castContent.attackersAfter || !castContent.attackersBefore) {
      this.attackersBefore = { droids: '?', tanks: '?', cannons: '?' };
      this.attackersDestroyed = defaultAttackersDestroyed;
      return;
    }
    this.attackersBefore = armyToArmyDescription(castContent.attackersBefore);
    this.attackersDestroyed = getArmyDamageDescription(
      castContent.attackersBefore,
      castContent.attackersAfter
    );
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
