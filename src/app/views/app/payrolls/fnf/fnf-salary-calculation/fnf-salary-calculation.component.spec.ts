import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FnfSalaryCalculationComponent } from './fnf-salary-calculation.component';

describe('FnfSalaryCalculationComponent', () => {
  let component: FnfSalaryCalculationComponent;
  let fixture: ComponentFixture<FnfSalaryCalculationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FnfSalaryCalculationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FnfSalaryCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
