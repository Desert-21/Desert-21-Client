import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SelectedFieldService } from 'src/app/services/rx-logic/selected-field.service';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss'],
})
export class RightPanelComponent implements OnInit, OnDestroy {
  isFieldSelected = false;

  private sub1: Subscription;

  constructor(private selectedFieldService: SelectedFieldService) {}

  ngOnInit(): void {
    this.sub1 = this.selectedFieldService.getStateUpdates().subscribe((fieldSelection) => {
      this.isFieldSelected = fieldSelection !== null;
    });
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
