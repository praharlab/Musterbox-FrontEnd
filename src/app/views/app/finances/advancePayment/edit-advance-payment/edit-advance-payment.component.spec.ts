import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditAdvancePaymentComponent } from './edit-advance-payment.component';

describe('EditAdvancePaymentComponent', () => {
  let component: EditAdvancePaymentComponent;
  let fixture: ComponentFixture<EditAdvancePaymentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditAdvancePaymentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAdvancePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
