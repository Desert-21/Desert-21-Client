import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-animated-slide-wrapper',
  templateUrl: './animated-slide-wrapper.component.html',
  styleUrls: ['./animated-slide-wrapper.component.scss']
})
export class AnimatedSlideWrapperComponent implements OnInit {

  animationClasses = 'animate__animated animate__backInLeft animate__faster';

  constructor() { }

  ngOnInit(): void {
  }

  rollLeft(): void {
    this.animationClasses = 'animate__animated animate__backOutLeft animate__faster';
    setTimeout(() => {
      this.animationClasses = 'animate__animated animate__backInRight animate__faster';
    }, 400);
  }

  rollRight(): void {
    this.animationClasses = 'animate__animated animate__backOutRight animate__faster';
    setTimeout(() => {
      this.animationClasses = 'animate__animated animate__backInLeft animate__faster';
    }, 400);
  }
}
