import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListAppointmentLetterComponent } from './list-appointment-letter.component';

describe('ListAppointmentLetterComponent', () => {
  let component: ListAppointmentLetterComponent;
  let fixture: ComponentFixture<ListAppointmentLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAppointmentLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAppointmentLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
