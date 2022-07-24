import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import {
  GameModalService,
  ModalType,
} from 'src/app/services/rx-logic/shared/game-modal.service';
import { textChangeRangeIsUnchanged } from 'typescript';

@Component({
  selector: 'app-game-modal',
  templateUrl: './game-modal.component.html',
  styleUrls: ['./game-modal.component.scss'],
})
export class GameModalComponent implements OnInit, OnDestroy {
  @ViewChild('movement', { read: TemplateRef })
  movement: TemplateRef<any>;

  @ViewChild('lab', { read: TemplateRef })
  lab: TemplateRef<any>;

  @ViewChild('resolution', { read: TemplateRef })
  resolution: TemplateRef<any>;

  private sub1: Subscription;

  constructor(
    private modalService: NgbModal,
    private gameModalService: GameModalService
  ) {}

  ngOnInit(): void {
    this.sub1 = this.gameModalService
      .getStateUpdates()
      .subscribe((modalType) => {
        const content = this.getContentToDisplay(modalType);
        const modalClass = this.getModalClass(modalType);
        const modalSize = this.getModalSize(modalType);
        this.modalService.open(content, {
          windowClass: modalClass,
          centered: true,
          size: modalSize,
        });
      });
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }

  // temporary
  private getContentToDisplay(modalType: ModalType): TemplateRef<any> {
    switch (modalType) {
      case 'ACTION':
        return null;
      case 'LAB':
        return this.lab;
      case 'MOVEMENT':
        return this.movement;
      case 'RESOLUTION':
        return this.resolution;
    }
  }

  private getModalClass(modalType: ModalType): string {
    switch (modalType) {
      case 'ACTION':
        return 'dark-modal';
      case 'LAB':
        return 'big-dark-modal';
      case 'MOVEMENT':
        return 'dark-modal';
      case 'RESOLUTION':
        return 'dark-modal';
    }
  }

  private getModalSize(modalType: ModalType): string {
    switch (modalType) {
      case 'ACTION':
        return null;
      case 'LAB':
        return 'xl';
      case 'MOVEMENT':
        return null;
      case 'RESOLUTION':
        return null;
    }
  }
}
