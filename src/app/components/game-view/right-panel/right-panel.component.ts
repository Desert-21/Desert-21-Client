import { Component, OnInit } from '@angular/core';
import { SelectedFieldService } from 'src/app/services/rx-logic/selected-field.service';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss'],
})
export class RightPanelComponent implements OnInit {
  isFieldSelected = false;

  constructor(private selectedFieldService: SelectedFieldService) {}

  ngOnInit(): void {
    this.selectedFieldService.getStateUpdates().subscribe((fieldSelection) => {
      this.isFieldSelected = fieldSelection !== null;
    });
  }
}
