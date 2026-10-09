import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeGoalComponent } from './list-employee-goal.component';

describe('ListEmployeeGoalComponent', () => {
  let component: ListEmployeeGoalComponent;
  let fixture: ComponentFixture<ListEmployeeGoalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmployeeGoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
