import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AttendaceCalendarComponent } from './attendace-calendar.component';

describe('AttendaceCalendarComponent', () => {
  let component: AttendaceCalendarComponent;
  let fixture: ComponentFixture<AttendaceCalendarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AttendaceCalendarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendaceCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
