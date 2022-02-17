import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnCounterComponent } from './turn-counter.component';

describe('TurnCounterComponent', () => {
  let component: TurnCounterComponent;
  let fixture: ComponentFixture<TurnCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TurnCounterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
