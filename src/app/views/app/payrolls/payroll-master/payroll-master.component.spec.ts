import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PayrollMasterComponent } from './payroll-master.component';

describe('PayrollMasterComponent', () => {
  let component: PayrollMasterComponent;
  let fixture: ComponentFixture<PayrollMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PayrollMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
