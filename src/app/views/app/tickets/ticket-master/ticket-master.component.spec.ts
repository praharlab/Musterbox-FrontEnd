import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TicketMasterComponent } from './ticket-master.component';

describe('TicketMasterComponent', () => {
  let component: TicketMasterComponent;
  let fixture: ComponentFixture<TicketMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TicketMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
