import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GameModalService, ModalType } from 'src/app/services/rx-logic/game-modal.service';
import { textChangeRangeIsUnchanged } from 'typescript';

@Component({
  selector: 'app-game-modal',
  templateUrl: './game-modal.component.html',
  styleUrls: ['./game-modal.component.scss'],
})
export class GameModalComponent implements OnInit {
  @ViewChild('content', { read: TemplateRef })
  content: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    private gameModalService: GameModalService
  ) {}

  ngOnInit(): void {
    this.gameModalService.getStateUpdates().subscribe(modalType => {
      const content = this.getContentToDisplay(modalType);
      this.modalService.open(content, {
        windowClass: 'dark-modal',
        centered: true,
      });
    });
  }

  openModalDialogCustomClass(): void {
    this.modalService.open(this.content, {
      windowClass: 'dark-modal',
      centered: true,
    });
  }

  // temporary
  private getContentToDisplay(modalType: ModalType): TemplateRef<any> {
    return this.content;
  }
}
