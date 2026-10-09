import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeSalarydetailComponent } from './list-employee-salarydetail.component';

describe('ListEmployeeSalarydetailComponent', () => {
  let component: ListEmployeeSalarydetailComponent;
  let fixture: ComponentFixture<ListEmployeeSalarydetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeSalarydetailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeSalarydetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
