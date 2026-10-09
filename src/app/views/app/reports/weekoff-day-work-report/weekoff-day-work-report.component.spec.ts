import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WeekoffDayWorkReportComponent } from './weekoff-day-work-report.component';

describe('WeekoffDayWorkReportComponent', () => {
  let component: WeekoffDayWorkReportComponent;
  let fixture: ComponentFixture<WeekoffDayWorkReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WeekoffDayWorkReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekoffDayWorkReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
