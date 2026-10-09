import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditAppointmentLetterComponent } from './edit-appointment-letter.component';

describe('EditAppointmentLetterComponent', () => {
  let component: EditAppointmentLetterComponent;
  let fixture: ComponentFixture<EditAppointmentLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAppointmentLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppointmentLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
