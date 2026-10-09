import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VerifyPerformanceReviewAnswerComponent } from './verify-performance-review-answer.component';

describe('VerifyPerformanceReviewAnswerComponent', () => {
  let component: VerifyPerformanceReviewAnswerComponent;
  let fixture: ComponentFixture<VerifyPerformanceReviewAnswerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyPerformanceReviewAnswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyPerformanceReviewAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
