import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnTimerButtonComponent } from './turn-timer-button.component';

describe('TurnTimerButtonComponent', () => {
  let component: TurnTimerButtonComponent;
  let fixture: ComponentFixture<TurnTimerButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TurnTimerButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnTimerButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
