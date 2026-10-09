import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListAdvancePaymentComponent } from './list-advance-payment.component';

describe('ListAdvancePaymentComponent', () => {
  let component: ListAdvancePaymentComponent;
  let fixture: ComponentFixture<ListAdvancePaymentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListAdvancePaymentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAdvancePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
