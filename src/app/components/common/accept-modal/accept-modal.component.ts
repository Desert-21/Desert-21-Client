import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AcceptModalActionService } from 'src/app/services/rx-logic/shared/accept-modal-action.service';

@Component({
  selector: 'app-accept-modal',
  templateUrl: './accept-modal.component.html',
  styleUrls: ['./accept-modal.component.scss'],
})
export class AcceptModalComponent implements OnInit, OnDestroy {
  @Input() modal: any;

  private sub1: Subscription;

  text = '';
  onAccept: () => void = () => {};
  onReject: () => void = () => {};

  constructor(private acceptActionsService: AcceptModalActionService) {}

  ngOnInit(): void {
    this.sub1 = this.acceptActionsService
      .getStateUpdates()
      .subscribe(({ text, onAccept, onReject }) => {
        this.text = text;
        this.onAccept = onAccept;
        this.onReject = onReject;
      });
    this.acceptActionsService.requestState();
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }

  accept(): void {
    this.onAccept();
    this.closeModal();
  }

  reject(): void {
    this.onReject();
    this.closeModal();
  }

  closeModal(): void {
    this.modal.close();
  }
}
