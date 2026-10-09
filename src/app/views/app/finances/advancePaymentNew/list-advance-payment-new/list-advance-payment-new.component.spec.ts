import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListAdvancePaymentNewComponent } from './list-advance-payment-new.component';

describe('ListAdvancePaymentNewComponent', () => {
  let component: ListAdvancePaymentNewComponent;
  let fixture: ComponentFixture<ListAdvancePaymentNewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListAdvancePaymentNewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAdvancePaymentNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
