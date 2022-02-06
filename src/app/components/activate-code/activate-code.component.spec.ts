import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateCodeComponent } from './activate-code.component';

describe('ActivateCodeComponent', () => {
  let component: ActivateCodeComponent;
  let fixture: ComponentFixture<ActivateCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivateCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
