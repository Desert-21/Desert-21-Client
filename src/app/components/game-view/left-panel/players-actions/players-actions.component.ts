import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlayersAction } from 'src/app/models/actions';
import { CurrentActionsService } from 'src/app/services/rx-logic/shared/current-actions.service';

@Component({
  selector: 'app-players-actions',
  templateUrl: './players-actions.component.html',
  styleUrls: ['./players-actions.component.scss'],
})
export class PlayersActionsComponent implements OnInit, OnDestroy {
  actions: Array<PlayersAction<any>> = [];

  private sub1: Subscription;

  constructor(private currentActionsService: CurrentActionsService) {}

  ngOnInit(): void {
    this.sub1 = this.currentActionsService.getStateUpdates().subscribe((actions) => {
      this.actions = actions;
    });
    this.currentActionsService.requestState();
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
