import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportExpensePaymentComponent } from './import-expense-payment.component';

describe('ImportExpensePaymentComponent', () => {
  let component: ImportExpensePaymentComponent;
  let fixture: ComponentFixture<ImportExpensePaymentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportExpensePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportExpensePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
