import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfirmModalActionService } from 'src/app/services/rx-logic/shared/confirm-modal-action.service';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent implements OnInit, OnDestroy {
  @Input() modal: any;

  private sub1: Subscription;

  text = '';
  onConfirm: () => void = () => {};

  constructor(private confirmModalActionService: ConfirmModalActionService) {}

  ngOnInit(): void {
    this.sub1 = this.confirmModalActionService
      .getStateUpdates()
      .subscribe(({ text, action }) => {
        this.text = text;
        this.onConfirm = action;
      });
    this.confirmModalActionService.requestState();
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }

  confirm(): void {
    this.onConfirm();
    this.closeModal();
  }

  closeModal(): void {
    this.modal.close();
  }
}
