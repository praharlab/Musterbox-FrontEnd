import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeSalaryPolicyComponent } from './list-employee-salary-policy.component';

describe('ListEmployeeSalaryPolicyComponent', () => {
  let component: ListEmployeeSalaryPolicyComponent;
  let fixture: ComponentFixture<ListEmployeeSalaryPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeSalaryPolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeSalaryPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
