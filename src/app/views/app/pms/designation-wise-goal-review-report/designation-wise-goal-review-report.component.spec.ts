import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DesignationWiseGoalReviewReportComponent } from './designation-wise-goal-review-report.component';

describe('DesignationWiseGoalReviewReportComponent', () => {
  let component: DesignationWiseGoalReviewReportComponent;
  let fixture: ComponentFixture<DesignationWiseGoalReviewReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignationWiseGoalReviewReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignationWiseGoalReviewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
