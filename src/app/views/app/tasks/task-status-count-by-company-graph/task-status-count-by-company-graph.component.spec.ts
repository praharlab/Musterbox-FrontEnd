import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaskStatusCountByCompanyGraphComponent } from './task-status-count-by-company-graph.component';

describe('TaskStatusCountByCompanyGraphComponent', () => {
  let component: TaskStatusCountByCompanyGraphComponent;
  let fixture: ComponentFixture<TaskStatusCountByCompanyGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskStatusCountByCompanyGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskStatusCountByCompanyGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
