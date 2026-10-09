import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListAttendanceCorrectionRequestComponent } from './list-attendance-correction-request.component';

describe('ListAttendanceCorrectionRequestComponent', () => {
  let component: ListAttendanceCorrectionRequestComponent;
  let fixture: ComponentFixture<ListAttendanceCorrectionRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAttendanceCorrectionRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAttendanceCorrectionRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
