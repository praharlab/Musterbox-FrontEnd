import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MonthAttendanceGraphComponent } from './month-attendance-graph.component';

describe('MonthAttendanceGraphComponent', () => {
  let component: MonthAttendanceGraphComponent;
  let fixture: ComponentFixture<MonthAttendanceGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MonthAttendanceGraphComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthAttendanceGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
