import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SalaryRegisterComponent } from './salary-register.component';

describe('SalaryRegisterComponent', () => {
  let component: SalaryRegisterComponent;
  let fixture: ComponentFixture<SalaryRegisterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SalaryRegisterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
