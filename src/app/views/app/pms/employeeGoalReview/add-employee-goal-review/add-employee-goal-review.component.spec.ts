import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddEmployeeGoalReviewComponent } from './add-employee-goal-review.component';

describe('AddEmployeeGoalReviewComponent', () => {
  let component: AddEmployeeGoalReviewComponent;
  let fixture: ComponentFixture<AddEmployeeGoalReviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEmployeeGoalReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeGoalReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
