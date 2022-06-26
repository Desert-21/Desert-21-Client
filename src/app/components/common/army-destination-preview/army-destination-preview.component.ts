import { Component, Input } from '@angular/core';
import { ArmyDescription } from '../../game-view/right-panel/army-preview/army-preview-state';

@Component({
  selector: 'app-army-destination-preview',
  templateUrl: './army-destination-preview.component.html',
  styleUrls: ['./army-destination-preview.component.scss'],
})
export class ArmyDestinationPreviewComponent {
  @Input() army: ArmyDescription = { droids: '0', tanks: '0', cannons: '0', scarabs: '0' };
  @Input() shouldShowScarabs = false;
  @Input() shouldShowArmy = true;
}
