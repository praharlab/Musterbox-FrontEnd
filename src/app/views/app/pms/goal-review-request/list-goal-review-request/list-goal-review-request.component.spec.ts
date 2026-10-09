import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListGoalReviewRequestComponent } from './list-goal-review-request.component';

describe('ListGoalReviewRequestComponent', () => {
  let component: ListGoalReviewRequestComponent;
  let fixture: ComponentFixture<ListGoalReviewRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListGoalReviewRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGoalReviewRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
