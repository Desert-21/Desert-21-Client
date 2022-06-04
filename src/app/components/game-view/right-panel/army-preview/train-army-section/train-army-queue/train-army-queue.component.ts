import { Component, Input, OnInit } from '@angular/core';
import { UnitType } from 'src/app/models/game-models';

@Component({
  selector: 'app-train-army-queue',
  templateUrl: './train-army-queue.component.html',
  styleUrls: ['./train-army-queue.component.scss']
})
export class TrainArmyQueueComponent implements OnInit {

  @Input() unitType: UnitType = 'DROID';
  @Input() amount = 0;
  @Input() turnsToExecute = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
