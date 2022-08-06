import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { PlayersAction } from '../models/actions';
import { ActionRelatedLocationsService } from '../services/rx-logic/shared/action-related-locations.service';

@Directive({
  selector: '[appActionFieldsSelector]'
})
export class ActionFieldsSelectorDirective {

  @Input()
  action: PlayersAction<any>;

  constructor(private actionRelatedLocationsService: ActionRelatedLocationsService) {}

  @HostListener('mouseenter', ['$event']) onEnter(e: MouseEvent): void {
    this.actionRelatedLocationsService.set(this.action.getRelatedLocations());
  }

  @HostListener('mouseleave', ['$event']) onLeave(e: MouseEvent): void {
    this.actionRelatedLocationsService.set([]);
  }
}
