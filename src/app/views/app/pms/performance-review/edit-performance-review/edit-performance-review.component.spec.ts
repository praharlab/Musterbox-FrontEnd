import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditPerformanceReviewComponent } from './edit-performance-review.component';

describe('EditPerformanceReviewComponent', () => {
  let component: EditPerformanceReviewComponent;
  let fixture: ComponentFixture<EditPerformanceReviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPerformanceReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPerformanceReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
