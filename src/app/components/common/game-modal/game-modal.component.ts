import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-game-modal',
  templateUrl: './game-modal.component.html',
  styleUrls: ['./game-modal.component.scss'],
})
export class GameModalComponent implements OnInit {
  @ViewChild('content', { read: TemplateRef })
  content: TemplateRef<any>;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  openModalDialogCustomClass(): void {
    this.modalService.open(this.content, {
      windowClass: 'dark-modal',
      centered: true,
    });
  }
}
