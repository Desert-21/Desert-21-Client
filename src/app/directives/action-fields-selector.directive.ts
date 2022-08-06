import { Directive, HostListener, Input, OnDestroy } from '@angular/core';
import { PlayersAction } from '../models/actions';
import { ActionRelatedLocationsService } from '../services/rx-logic/shared/action-related-locations.service';

@Directive({
  selector: '[appActionFieldsSelector]'
})
export class ActionFieldsSelectorDirective implements OnDestroy {

  @Input()
  action: PlayersAction<any>;

  constructor(private actionRelatedLocationsService: ActionRelatedLocationsService) {}

  @HostListener('mouseenter', ['$event']) onEnter(e: MouseEvent): void {
    this.actionRelatedLocationsService.set(this.action.getRelatedLocations());
  }

  @HostListener('mouseleave', ['$event']) onLeave(e: MouseEvent): void {
    this.actionRelatedLocationsService.set([]);
  }

  ngOnDestroy(): void {
    this.actionRelatedLocationsService.set([]);
  }
}
