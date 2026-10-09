import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TicketDashboardTicketSubcategoryComponent } from './ticket-dashboard-ticket-subcategory.component';

describe('TicketDashboardTicketSubcategoryComponent', () => {
  let component: TicketDashboardTicketSubcategoryComponent;
  let fixture: ComponentFixture<TicketDashboardTicketSubcategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TicketDashboardTicketSubcategoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDashboardTicketSubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
