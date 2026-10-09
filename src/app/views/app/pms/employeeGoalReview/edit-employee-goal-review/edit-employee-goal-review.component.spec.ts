import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditEmployeeGoalReviewComponent } from './edit-employee-goal-review.component';

describe('EditEmployeeGoalReviewComponent', () => {
  let component: EditEmployeeGoalReviewComponent;
  let fixture: ComponentFixture<EditEmployeeGoalReviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEmployeeGoalReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployeeGoalReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
