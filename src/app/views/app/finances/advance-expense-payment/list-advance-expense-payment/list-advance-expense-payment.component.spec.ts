import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListAdvanceExpensePaymentComponent } from './list-advance-expense-payment.component';

describe('ListAdvanceExpensePaymentComponent', () => {
  let component: ListAdvanceExpensePaymentComponent;
  let fixture: ComponentFixture<ListAdvanceExpensePaymentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAdvanceExpensePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAdvanceExpensePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
