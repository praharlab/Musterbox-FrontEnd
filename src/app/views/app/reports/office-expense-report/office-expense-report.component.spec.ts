import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfficeExpenseReportComponent } from './office-expense-report.component';

describe('OfficeExpenseReportComponent', () => {
  let component: OfficeExpenseReportComponent;
  let fixture: ComponentFixture<OfficeExpenseReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficeExpenseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeExpenseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
