import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { Army } from 'src/app/models/game-models';
import {
  AppNotification,
  FieldConquestAttackerOnlyNotification,
  FieldConquestFullPictureNotification,
} from 'src/app/models/notification-models';
import { MinimapSelectedLocationService } from 'src/app/services/rx-logic/resolution-phase/minimap-selected-location.service';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import {
  fightingArmyToArmyDescription,
  getFightingArmyDamageDescription,
} from 'src/app/utils/army-utils';
import { ArmyDescription } from '../../../right-panel/army-preview/army-preview-state';

type AgainstPlayerBattleNotificationContent =
  | FieldConquestFullPictureNotification
  | FieldConquestAttackerOnlyNotification;

type AgainstScarabsBattleNotificationType =
  | 'ENEMY_CONQUEST_FAILED'
  | 'PLAYERS_CONQUEST_FAILED'
  | 'ENEMY_CONQUEST_SUCCEEDED'
  | 'PLAYERS_CONQUEST_SUCCEEDED';

const defaultDefendersBefore: ArmyDescription = {
  droids: '?',
  tanks: '?',
  cannons: '?',
  scarabs: '?',
};

const defaultDefendersDestroyed: ArmyDescription = {
  droids: '- ???',
  tanks: '- ???',
  cannons: '- ???',
  scarabs: '- ???',
};

@Component({
  selector: 'app-battle-against-player-notification',
  templateUrl: './battle-against-player-notification.component.html',
  styleUrls: ['./battle-against-player-notification.component.scss'],
})
export class BattleAgainstPlayerNotificationComponent
  implements OnInit, OnDestroy
{
  private notificationSubject = new BehaviorSubject<
    AppNotification<AgainstPlayerBattleNotificationContent>
  >(null);

  notificationTitle = '';

  attackersBefore: Army = { droids: 0, tanks: 0, cannons: 0 };
  attackersDestroyed: ArmyDescription = {
    droids: '',
    tanks: '',
    cannons: '',
  };

  defendersBefore: ArmyDescription = defaultDefendersBefore;
  defendersDestroyed: ArmyDescription = defaultDefendersDestroyed;

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
      this.enrichArmyDescriptions(notification.content);
    });
    this.gameContextService.requestState();
  }

  private enrichArmyDescriptions(
    content: AgainstPlayerBattleNotificationContent
  ): void {
    this.attackersBefore = content.attackersBefore;
    this.attackersDestroyed = getFightingArmyDamageDescription(
      content.attackersBefore,
      content.attackersAfter
    );
    const castContent = content as FieldConquestFullPictureNotification;
    if (!castContent.defendersAfter || !castContent.defendersAfter) {
      this.defendersBefore = defaultDefendersBefore;
      this.defendersDestroyed = defaultDefendersDestroyed;
      return;
    }
    this.defendersBefore = fightingArmyToArmyDescription(
      castContent.defendersBefore
    );
    this.defendersDestroyed = getFightingArmyDamageDescription(
      castContent.defendersBefore,
      castContent.defendersAfter
    );
  }

  private getNotificationTitle(
    notificationType: AgainstScarabsBattleNotificationType
  ): string {
    switch (notificationType) {
      case 'ENEMY_CONQUEST_FAILED':
        return 'Your opponent failed to conquer your field';
      case 'ENEMY_CONQUEST_SUCCEEDED':
        return 'Your opponent conquered your field';
      case 'PLAYERS_CONQUEST_FAILED':
        return 'You failed to conquer enemy field';
      case 'PLAYERS_CONQUEST_SUCCEEDED':
        return 'You have conquered enemy field';
    }
  }

  get notification(): AppNotification<AgainstPlayerBattleNotificationContent> {
    return this.notificationSubject.getValue();
  }

  @Input()
  set notification(
    notification: AppNotification<AgainstPlayerBattleNotificationContent>
  ) {
    this.notificationSubject.next(notification);
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
