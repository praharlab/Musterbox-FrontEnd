import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmpBonusPaymentComponent } from './emp-bonus-payment.component';

describe('EmpBonusPaymentComponent', () => {
  let component: EmpBonusPaymentComponent;
  let fixture: ComponentFixture<EmpBonusPaymentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpBonusPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpBonusPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
