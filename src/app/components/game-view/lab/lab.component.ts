import { Component, OnInit } from '@angular/core';
import { GameModalService } from 'src/app/services/rx-logic/shared/game-modal.service';

@Component({
  selector: 'app-lab',
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.scss']
})
export class LabComponent implements OnInit {

  classes = '';

  constructor(private gameModalService: GameModalService) { }

  ngOnInit(): void {
  }

  openLab(): void {
    this.gameModalService.openModal('LAB');
  }
}
