import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UnitsTrainedNotification } from 'src/app/models/notification-models';
import { MinimapSelectedLocationService } from 'src/app/services/rx-logic/resolution-phase/minimap-selected-location.service';
import { getUnitImage } from 'src/app/utils/army-utils';

@Component({
  selector: 'app-units-trained-notification',
  templateUrl: './units-trained-notification.component.html',
  styleUrls: ['./units-trained-notification.component.scss'],
})
export class UnitsTrainedNotificationComponent implements OnInit, OnDestroy {
  private notificationSubject = new BehaviorSubject<UnitsTrainedNotification>(
    null
  );
  imageSource = '';
  amount = 0;

  sub1: Subscription;

  constructor(private minimapLocationService: MinimapSelectedLocationService) {}

  ngOnInit(): void {
    this.sub1 = this.notificationSubject
      .asObservable()
      .subscribe((notification) => {
        this.minimapLocationService.set(notification.location);
        this.imageSource = getUnitImage(notification.unitType);
        this.amount = notification.amount;
      });
  }

  get notification(): UnitsTrainedNotification {
    return this.notificationSubject.getValue();
  }

  @Input()
  set notification(notification: UnitsTrainedNotification) {
    this.notificationSubject.next(notification);
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
