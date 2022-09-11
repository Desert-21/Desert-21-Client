import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss'],
})
export class ErrorModalComponent implements OnInit {
  @ViewChild('errors', { read: TemplateRef })
  errors: TemplateRef<any>;

  message = 'You are seing this error, because something wrong has happened!';

  activeModal: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.errorService
      .getErrorUpdates()
      .pipe(debounceTime(300))
      .subscribe((msg) => {
        this.message = msg;
        this.openModal();
      });
  }

  openModal(): void {
    if (this.modalService.hasOpenModals()) {
      this.modalService.dismissAll();
    }
    this.activeModal = this.modalService.open(this.errors, {
      windowClass: 'error-modal',
      centered: true,
      size: 'm',
    });
  }
}
