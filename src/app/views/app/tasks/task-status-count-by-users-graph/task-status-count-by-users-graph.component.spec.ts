import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaskStatusCountByUsersGraphComponent } from './task-status-count-by-users-graph.component';

describe('TaskStatusCountByUsersGraphComponent', () => {
  let component: TaskStatusCountByUsersGraphComponent;
  let fixture: ComponentFixture<TaskStatusCountByUsersGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskStatusCountByUsersGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskStatusCountByUsersGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
