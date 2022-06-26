import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { GameModalService, ModalType } from 'src/app/services/rx-logic/shared/game-modal.service';
import { textChangeRangeIsUnchanged } from 'typescript';

@Component({
  selector: 'app-game-modal',
  templateUrl: './game-modal.component.html',
  styleUrls: ['./game-modal.component.scss'],
})
export class GameModalComponent implements OnInit, OnDestroy {
  @ViewChild('content', { read: TemplateRef })
  content: TemplateRef<any>;

  private sub1: Subscription;

  constructor(
    private modalService: NgbModal,
    private gameModalService: GameModalService
  ) {}

  ngOnInit(): void {
    this.sub1 = this.gameModalService.getStateUpdates().subscribe(modalType => {
      const content = this.getContentToDisplay(modalType);
      this.modalService.open(content, {
        windowClass: 'dark-modal',
        centered: true,
      });
    });
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
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
