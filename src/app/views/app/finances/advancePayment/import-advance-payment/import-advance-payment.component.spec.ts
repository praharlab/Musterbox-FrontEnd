import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportAdvancePaymentComponent } from './import-advance-payment.component';

describe('ImportAdvancePaymentComponent', () => {
  let component: ImportAdvancePaymentComponent;
  let fixture: ComponentFixture<ImportAdvancePaymentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportAdvancePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAdvancePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
