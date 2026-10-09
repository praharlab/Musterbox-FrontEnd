import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PendingTaskPercentageWiseGraphComponent } from './pending-task-percentage-wise-graph.component';

describe('PendingTaskPercentageWiseGraphComponent', () => {
  let component: PendingTaskPercentageWiseGraphComponent;
  let fixture: ComponentFixture<PendingTaskPercentageWiseGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingTaskPercentageWiseGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingTaskPercentageWiseGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
