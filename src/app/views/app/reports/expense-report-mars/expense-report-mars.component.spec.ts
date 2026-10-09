import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpenseReportMarsComponent } from './expense-report-mars.component';

describe('ExpenseReportMarsComponent', () => {
  let component: ExpenseReportMarsComponent;
  let fixture: ComponentFixture<ExpenseReportMarsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseReportMarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseReportMarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
