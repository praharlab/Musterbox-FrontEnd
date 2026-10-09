import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpensePaymentComponent } from './expense-payment.component';

describe('ExpensePaymentComponent', () => {
  let component: ExpensePaymentComponent;
  let fixture: ComponentFixture<ExpensePaymentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExpensePaymentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
