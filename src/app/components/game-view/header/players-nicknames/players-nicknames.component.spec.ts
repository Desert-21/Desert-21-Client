import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersNicknamesComponent } from './players-nicknames.component';

describe('PlayersNicknamesComponent', () => {
  let component: PlayersNicknamesComponent;
  let fixture: ComponentFixture<PlayersNicknamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayersNicknamesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersNicknamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
