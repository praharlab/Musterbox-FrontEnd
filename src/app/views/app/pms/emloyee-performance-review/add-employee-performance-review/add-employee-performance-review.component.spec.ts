import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddEmployeePerformanceReviewComponent } from './add-employee-performance-review.component';

describe('AddEmployeePerformanceReviewComponent', () => {
  let component: AddEmployeePerformanceReviewComponent;
  let fixture: ComponentFixture<AddEmployeePerformanceReviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEmployeePerformanceReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeePerformanceReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
