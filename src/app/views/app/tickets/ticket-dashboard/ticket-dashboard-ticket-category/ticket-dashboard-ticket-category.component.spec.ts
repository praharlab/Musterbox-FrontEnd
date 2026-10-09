import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TicketDashboardTicketCategoryComponent } from './ticket-dashboard-ticket-category.component';

describe('TicketDashboardTicketCategoryComponent', () => {
  let component: TicketDashboardTicketCategoryComponent;
  let fixture: ComponentFixture<TicketDashboardTicketCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TicketDashboardTicketCategoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDashboardTicketCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
