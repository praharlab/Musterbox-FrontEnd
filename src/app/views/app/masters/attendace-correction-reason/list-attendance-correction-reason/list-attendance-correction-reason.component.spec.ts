import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListAttendanceCorrectionReasonComponent } from './list-attendance-correction-reason.component';

describe('ListAttendanceCorrectionReasonComponent', () => {
  let component: ListAttendanceCorrectionReasonComponent;
  let fixture: ComponentFixture<ListAttendanceCorrectionReasonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAttendanceCorrectionReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAttendanceCorrectionReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
