import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ToastEntry,
  ToastsService,
} from 'src/app/services/rx-logic/shared/toasts.service';

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.scss'],
})
export class ToastsComponent implements OnInit, OnDestroy {

  activeToasts: Array<ToastEntry> = [];

  private sub1: Subscription;

  constructor(private toastsService: ToastsService) {}

  ngOnInit(): void {
    this.sub1 = this.toastsService.getStateUpdates().subscribe((toasts) => {
      this.activeToasts = toasts;
    });
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }

  close(toast: ToastEntry): void {
    this.toastsService.remove(toast);
  }
}
