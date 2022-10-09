import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-actions-modal',
  templateUrl: './no-actions-modal.component.html',
  styleUrls: ['./no-actions-modal.component.scss']
})
export class NoActionsModalComponent implements OnInit {

  @Input() modal: any;

  constructor() { }

  ngOnInit(): void {
  }

}
