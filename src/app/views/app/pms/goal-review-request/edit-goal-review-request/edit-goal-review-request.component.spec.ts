import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditGoalReviewRequestComponent } from './edit-goal-review-request.component';

describe('EditGoalReviewRequestComponent', () => {
  let component: EditGoalReviewRequestComponent;
  let fixture: ComponentFixture<EditGoalReviewRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGoalReviewRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGoalReviewRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
