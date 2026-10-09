import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TicketDashboardTicketByAgentComponent } from './ticket-dashboard-ticket-by-agent.component';

describe('TicketDashboardTicketByAgentComponent', () => {
  let component: TicketDashboardTicketByAgentComponent;
  let fixture: ComponentFixture<TicketDashboardTicketByAgentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TicketDashboardTicketByAgentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDashboardTicketByAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
