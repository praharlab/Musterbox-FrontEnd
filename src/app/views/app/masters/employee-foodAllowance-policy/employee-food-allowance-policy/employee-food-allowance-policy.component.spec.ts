import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeFoodAllowancePolicyComponent } from './employee-food-allowance-policy.component';

describe('EmployeeFoodAllowancePolicyComponent', () => {
  let component: EmployeeFoodAllowancePolicyComponent;
  let fixture: ComponentFixture<EmployeeFoodAllowancePolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeFoodAllowancePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeFoodAllowancePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
