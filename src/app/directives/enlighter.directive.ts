import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appEnlighter]'
})
export class EnlighterDirective {

  constructor(private ref: ElementRef, private renderer: Renderer2) { }

  @HostListener('mouseenter', ['$event']) onEnter( e: MouseEvent ) {
    this.renderer.addClass(this.ref.nativeElement, "enlightment");
  }

  @HostListener('mouseleave', ['$event']) onLeave( e: MouseEvent ) {
    this.renderer.removeClass(this.ref.nativeElement, "enlightment");
    this.unselect();
  }

  @HostListener('mousedown', ['$event']) onMouseUp( e: MouseEvent ) {
    this.select();
  }

  @HostListener('mouseup', ['$event']) onMouseDown( e: MouseEvent ) {
    this.unselect();
  }

  select(){
    this.renderer.addClass(this.ref.nativeElement, "selecting");
  }

  unselect(){
    this.renderer.removeClass(this.ref.nativeElement, "selecting");
  }
}
