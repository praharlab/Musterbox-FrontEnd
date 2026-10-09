import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditEmployeePerformanceReviewComponent } from './edit-employee-performance-review.component';

describe('EditEmployeePerformanceReviewComponent', () => {
  let component: EditEmployeePerformanceReviewComponent;
  let fixture: ComponentFixture<EditEmployeePerformanceReviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEmployeePerformanceReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployeePerformanceReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
