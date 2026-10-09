import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EMailSalarySlipComponent } from './e-mail-salary-slip.component';

describe('EMailSalarySlipComponent', () => {
  let component: EMailSalarySlipComponent;
  let fixture: ComponentFixture<EMailSalarySlipComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EMailSalarySlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EMailSalarySlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
