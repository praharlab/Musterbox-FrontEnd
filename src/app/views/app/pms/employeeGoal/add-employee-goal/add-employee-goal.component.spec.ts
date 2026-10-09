import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddEmployeeGoalComponent } from './add-employee-goal.component';

describe('AddEmployeeGoalComponent', () => {
  let component: AddEmployeeGoalComponent;
  let fixture: ComponentFixture<AddEmployeeGoalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEmployeeGoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
