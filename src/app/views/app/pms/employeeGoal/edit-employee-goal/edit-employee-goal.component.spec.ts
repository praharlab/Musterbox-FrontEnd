import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditEmployeeGoalComponent } from './edit-employee-goal.component';

describe('EditEmployeeGoalComponent', () => {
  let component: EditEmployeeGoalComponent;
  let fixture: ComponentFixture<EditEmployeeGoalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEmployeeGoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployeeGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
