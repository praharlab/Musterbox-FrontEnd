import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditAttendanceCorrectionRequestComponent } from './edit-attendance-correction-request.component';

describe('EditAttendanceCorrectionRequestComponent', () => {
  let component: EditAttendanceCorrectionRequestComponent;
  let fixture: ComponentFixture<EditAttendanceCorrectionRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAttendanceCorrectionRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAttendanceCorrectionRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
