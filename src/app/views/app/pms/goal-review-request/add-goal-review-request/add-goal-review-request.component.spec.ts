import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddGoalReviewRequestComponent } from './add-goal-review-request.component';

describe('AddGoalReviewRequestComponent', () => {
  let component: AddGoalReviewRequestComponent;
  let fixture: ComponentFixture<AddGoalReviewRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGoalReviewRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGoalReviewRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
