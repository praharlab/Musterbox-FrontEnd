import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditAdvanceExpensePaymentComponent } from './edit-advance-expense-payment.component';

describe('EditAdvanceExpensePaymentComponent', () => {
  let component: EditAdvanceExpensePaymentComponent;
  let fixture: ComponentFixture<EditAdvanceExpensePaymentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAdvanceExpensePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAdvanceExpensePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
