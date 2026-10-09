import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListPerformanceReviewComponent } from './list-performance-review.component';

describe('ListPerformanceReviewComponent', () => {
  let component: ListPerformanceReviewComponent;
  let fixture: ComponentFixture<ListPerformanceReviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPerformanceReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPerformanceReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
