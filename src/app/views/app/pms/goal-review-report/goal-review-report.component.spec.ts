import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GoalReviewReportComponent } from './goal-review-report.component';

describe('GoalReviewReportComponent', () => {
  let component: GoalReviewReportComponent;
  let fixture: ComponentFixture<GoalReviewReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalReviewReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalReviewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
