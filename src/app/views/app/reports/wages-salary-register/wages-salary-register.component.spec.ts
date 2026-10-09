import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WagesSalaryRegisterComponent } from './wages-salary-register.component';

describe('WagesSalaryRegisterComponent', () => {
  let component: WagesSalaryRegisterComponent;
  let fixture: ComponentFixture<WagesSalaryRegisterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WagesSalaryRegisterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WagesSalaryRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
