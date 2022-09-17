import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { LabUpgradeNotification } from 'src/app/models/notification-models';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import { labUpgradeToImagePath } from 'src/app/utils/lab-utils';
import { underscoreToRegular } from 'src/app/utils/text-utils';

@Component({
  selector: 'app-lab-upgrade-notification',
  templateUrl: './lab-upgrade-notification.component.html',
  styleUrls: ['./lab-upgrade-notification.component.scss'],
})
export class LabUpgradeNotificationComponent implements OnInit, OnDestroy {
  notificationSubject = new BehaviorSubject<LabUpgradeNotification>(null);
  isPlayerWhoUpgraded = true;
  imageSource = '';
  upgradeName = '';

  sub1: Subscription;

  constructor(private gameContextService: GameContextService) {}

  ngOnInit(): void {
    this.sub1 = combineLatest([
      this.notificationSubject.asObservable(),
      this.gameContextService.getStateUpdates(),
    ]).subscribe(([notification, context]) => {
      this.isPlayerWhoUpgraded = context.player.id === notification.playerId;
      this.imageSource = labUpgradeToImagePath(notification.upgrade);
      this.upgradeName = underscoreToRegular(notification.upgrade);
    });
    this.gameContextService.requestState();
  }

  get notification(): LabUpgradeNotification {
    return this.notificationSubject.getValue();
  }

  @Input()
  set notification(notification: LabUpgradeNotification) {
    this.notificationSubject.next(notification);
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
