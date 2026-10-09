import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TicketDashboardPriorityComponent } from './ticket-dashboard-priority.component';

describe('TicketDashboardPriorityComponent', () => {
  let component: TicketDashboardPriorityComponent;
  let fixture: ComponentFixture<TicketDashboardPriorityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TicketDashboardPriorityComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDashboardPriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
