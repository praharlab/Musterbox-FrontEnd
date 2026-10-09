import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAdvanceExpensePaymentComponent } from './add-advance-expense-payment.component';

describe('AddAdvanceExpensePaymentComponent', () => {
  let component: AddAdvanceExpensePaymentComponent;
  let fixture: ComponentFixture<AddAdvanceExpensePaymentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAdvanceExpensePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdvanceExpensePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
