import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TicketDashboardStatusComponent } from './ticket-dashboard-status.component';

describe('TicketDashboardStatusComponent', () => {
  let component: TicketDashboardStatusComponent;
  let fixture: ComponentFixture<TicketDashboardStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TicketDashboardStatusComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDashboardStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
