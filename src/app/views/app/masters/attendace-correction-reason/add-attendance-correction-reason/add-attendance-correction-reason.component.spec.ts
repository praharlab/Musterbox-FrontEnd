import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAttendanceCorrectionReasonComponent } from './add-attendance-correction-reason.component';

describe('AddAttendanceCorrectionReasonComponent', () => {
  let component: AddAttendanceCorrectionReasonComponent;
  let fixture: ComponentFixture<AddAttendanceCorrectionReasonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAttendanceCorrectionReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAttendanceCorrectionReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
