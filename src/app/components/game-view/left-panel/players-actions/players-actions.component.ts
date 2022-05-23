import { Component, OnInit } from '@angular/core';
import { PlayersAction } from 'src/app/models/actions';
import { CurrentActionsService } from 'src/app/services/rx-logic/current-actions.service';

@Component({
  selector: 'app-players-actions',
  templateUrl: './players-actions.component.html',
  styleUrls: ['./players-actions.component.scss']
})
export class PlayersActionsComponent implements OnInit {

  actions: Array<PlayersAction<any>> = [];

  constructor(private currentActionsService: CurrentActionsService) { }

  ngOnInit(): void {
    this.currentActionsService.getStateUpdates().subscribe(actions => {
      this.actions = actions;
    });
    this.currentActionsService.requestState();
  }

}
