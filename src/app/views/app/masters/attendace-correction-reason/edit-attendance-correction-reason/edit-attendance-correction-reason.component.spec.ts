import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditAttendanceCorrectionReasonComponent } from './edit-attendance-correction-reason.component';

describe('EditAttendanceCorrectionReasonComponent', () => {
  let component: EditAttendanceCorrectionReasonComponent;
  let fixture: ComponentFixture<EditAttendanceCorrectionReasonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAttendanceCorrectionReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAttendanceCorrectionReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
