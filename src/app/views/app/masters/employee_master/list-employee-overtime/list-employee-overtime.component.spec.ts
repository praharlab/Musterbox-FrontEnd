import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeOvertimeComponent } from './list-employee-overtime.component';

describe('ListEmployeeOvertimeComponent', () => {
  let component: ListEmployeeOvertimeComponent;
  let fixture: ComponentFixture<ListEmployeeOvertimeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeOvertimeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeOvertimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
