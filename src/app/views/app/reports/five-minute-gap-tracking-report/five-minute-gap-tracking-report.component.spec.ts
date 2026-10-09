import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FiveMinuteGapTrackingReportComponent } from './five-minute-gap-tracking-report.component';

describe('FiveMinuteGapTrackingReportComponent', () => {
  let component: FiveMinuteGapTrackingReportComponent;
  let fixture: ComponentFixture<FiveMinuteGapTrackingReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FiveMinuteGapTrackingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiveMinuteGapTrackingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
