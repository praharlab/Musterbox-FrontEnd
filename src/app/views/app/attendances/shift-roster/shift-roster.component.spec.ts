import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShiftRosterComponent } from './shift-roster.component';

describe('ShiftRosterComponent', () => {
  let component: ShiftRosterComponent;
  let fixture: ComponentFixture<ShiftRosterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftRosterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftRosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
