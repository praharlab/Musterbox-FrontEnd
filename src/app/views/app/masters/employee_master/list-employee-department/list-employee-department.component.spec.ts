import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeDepartmentComponent } from './list-employee-department.component';

describe('ListEmployeeDepartmentComponent', () => {
  let component: ListEmployeeDepartmentComponent;
  let fixture: ComponentFixture<ListEmployeeDepartmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeDepartmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
