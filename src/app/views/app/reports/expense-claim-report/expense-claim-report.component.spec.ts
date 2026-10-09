import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpenseClaimReportComponent } from './expense-claim-report.component';

describe('ExpenseClaimReportComponent', () => {
  let component: ExpenseClaimReportComponent;
  let fixture: ComponentFixture<ExpenseClaimReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseClaimReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseClaimReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
