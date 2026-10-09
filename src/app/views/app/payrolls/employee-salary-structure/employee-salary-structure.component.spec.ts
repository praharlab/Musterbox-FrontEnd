import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeSalaryStructureComponent } from './employee-salary-structure.component';

describe('EmployeeSalaryStructureComponent', () => {
  let component: EmployeeSalaryStructureComponent;
  let fixture: ComponentFixture<EmployeeSalaryStructureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeSalaryStructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSalaryStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
