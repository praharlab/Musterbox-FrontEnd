import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HourlySalaryRegisterComponent } from './hourly-salary-register.component';

describe('HourlySalaryRegisterComponent', () => {
  let component: HourlySalaryRegisterComponent;
  let fixture: ComponentFixture<HourlySalaryRegisterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HourlySalaryRegisterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HourlySalaryRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
