import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAttendanceCorrectionRequestComponent } from './add-attendance-correction-request.component';

describe('AddAttendanceCorrectionRequestComponent', () => {
  let component: AddAttendanceCorrectionRequestComponent;
  let fixture: ComponentFixture<AddAttendanceCorrectionRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAttendanceCorrectionRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAttendanceCorrectionRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
