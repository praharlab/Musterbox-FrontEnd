import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeGoalReviewComponent } from './list-employee-goal-review.component';

describe('ListEmployeeGoalReviewComponent', () => {
  let component: ListEmployeeGoalReviewComponent;
  let fixture: ComponentFixture<ListEmployeeGoalReviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmployeeGoalReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeGoalReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
