import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VisitReportCustomerComponent } from './visit-report-customer.component';

describe('VisitReportCustomerComponent', () => {
  let component: VisitReportCustomerComponent;
  let fixture: ComponentFixture<VisitReportCustomerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VisitReportCustomerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitReportCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
