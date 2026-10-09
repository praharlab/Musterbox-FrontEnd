import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SalaryRegisterWithDateOfPayComponent } from './salary-register-with-date-of-pay.component';

describe('SalaryRegisterWithDateOfPayComponent', () => {
  let component: SalaryRegisterWithDateOfPayComponent;
  let fixture: ComponentFixture<SalaryRegisterWithDateOfPayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SalaryRegisterWithDateOfPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryRegisterWithDateOfPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
