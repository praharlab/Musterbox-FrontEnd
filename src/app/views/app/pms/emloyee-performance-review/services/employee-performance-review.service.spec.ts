import { TestBed } from '@angular/core/testing';

import { EmployeePerformanceReviewService } from './employee-performance-review.service';

describe('EmployeePerformanceReviewService', () => {
  let service: EmployeePerformanceReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeePerformanceReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
