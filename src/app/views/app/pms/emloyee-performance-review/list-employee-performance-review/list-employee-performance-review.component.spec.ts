import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeePerformanceReviewComponent } from './list-employee-performance-review.component';

describe('ListEmployeePerformanceReviewComponent', () => {
  let component: ListEmployeePerformanceReviewComponent;
  let fixture: ComponentFixture<ListEmployeePerformanceReviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmployeePerformanceReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeePerformanceReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
