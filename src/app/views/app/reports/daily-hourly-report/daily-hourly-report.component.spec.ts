import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DailyHourlyReportComponent } from './daily-hourly-report.component';

describe('DailyHourlyReportComponent', () => {
  let component: DailyHourlyReportComponent;
  let fixture: ComponentFixture<DailyHourlyReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyHourlyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyHourlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
