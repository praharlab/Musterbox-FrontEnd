import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShowShiftRosterDataComponent } from './show-shift-roster-data.component';

describe('ShowShiftRosterDataComponent', () => {
  let component: ShowShiftRosterDataComponent;
  let fixture: ComponentFixture<ShowShiftRosterDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowShiftRosterDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowShiftRosterDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
