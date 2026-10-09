import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaskCreatedAndStartDateGraphComponent } from './task-created-and-start-date-graph.component';

describe('TaskCreatedAndStartDateGraphComponent', () => {
  let component: TaskCreatedAndStartDateGraphComponent;
  let fixture: ComponentFixture<TaskCreatedAndStartDateGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskCreatedAndStartDateGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCreatedAndStartDateGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
