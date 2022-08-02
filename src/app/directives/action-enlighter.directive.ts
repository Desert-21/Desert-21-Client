import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appActionEnlighter]',
})
export class ActionEnlighterDirective {
  constructor(private ref: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter', ['$event']) onEnter(e: MouseEvent): void {
    this.renderer.addClass(this.ref.nativeElement, 'action-enlightment');
  }

  @HostListener('mouseleave', ['$event']) onLeave(e: MouseEvent): void {
    this.renderer.removeClass(this.ref.nativeElement, 'action-enlightment');
  }
}
