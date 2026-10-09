import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DailyVehicleUsageReportComponent } from './daily-vehicle-usage-report.component';

describe('DailyVehicleUsageReportComponent', () => {
  let component: DailyVehicleUsageReportComponent;
  let fixture: ComponentFixture<DailyVehicleUsageReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DailyVehicleUsageReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyVehicleUsageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
