import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddPerformanceReviewComponent } from './add-performance-review.component';

describe('AddPerformanceReviewComponent', () => {
  let component: AddPerformanceReviewComponent;
  let fixture: ComponentFixture<AddPerformanceReviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPerformanceReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPerformanceReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
