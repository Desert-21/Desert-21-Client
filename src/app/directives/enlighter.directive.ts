import {
  Directive,
  HostListener,
  ElementRef,
  Renderer2,
  Input,
} from '@angular/core';

@Directive({
  selector: '[appEnlighter]',
})
export class EnlighterDirective {
  @Input() isEnlighterEnabled = true;

  constructor(private ref: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter', ['$event']) onEnter(e: MouseEvent): void {
    if (this.isEnlighterEnabled) {
      this.renderer.addClass(this.ref.nativeElement, 'enlightment');
    }
  }

  @HostListener('mouseleave', ['$event']) onLeave(e: MouseEvent): void {
    if (this.isEnlighterEnabled) {
      this.renderer.removeClass(this.ref.nativeElement, 'enlightment');
      this.unselect();
    }
  }

  @HostListener('mousedown', ['$event']) onMouseUp(e: MouseEvent): void {
    if (this.isEnlighterEnabled) {
      this.select();
    }
  }

  @HostListener('mouseup', ['$event']) onMouseDown(e: MouseEvent): void {
    if (this.isEnlighterEnabled) {
      this.unselect();
    }
  }

  select(): void {
    this.renderer.addClass(this.ref.nativeElement, 'selecting');
  }

  unselect(): void {
    this.renderer.removeClass(this.ref.nativeElement, 'selecting');
  }
}
