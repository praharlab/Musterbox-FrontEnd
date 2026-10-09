import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyAdvancePaymentComponent } from './company-advance-payment.component';

describe('CompanyAdvancePaymentComponent', () => {
  let component: CompanyAdvancePaymentComponent;
  let fixture: ComponentFixture<CompanyAdvancePaymentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyAdvancePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAdvancePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
