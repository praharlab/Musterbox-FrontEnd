import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAppointmentLetterComponent } from './add-appointment-letter.component';

describe('AddAppointmentLetterComponent', () => {
  let component: AddAppointmentLetterComponent;
  let fixture: ComponentFixture<AddAppointmentLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAppointmentLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAppointmentLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
