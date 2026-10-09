import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeLeaveBalComponent } from './list-employee-leave-bal.component';

describe('ListEmployeeLeaveBalComponent', () => {
  let component: ListEmployeeLeaveBalComponent;
  let fixture: ComponentFixture<ListEmployeeLeaveBalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeLeaveBalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeLeaveBalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
