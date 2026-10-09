import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PerformanceReviewReportComponent } from './performance-review-report.component';

describe('PerformanceReviewReportComponent', () => {
  let component: PerformanceReviewReportComponent;
  let fixture: ComponentFixture<PerformanceReviewReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformanceReviewReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceReviewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
