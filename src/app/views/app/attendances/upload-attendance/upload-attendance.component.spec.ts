import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadAttendanceComponent } from './upload-attendance.component';

describe('UploadAttendanceComponent', () => {
  let component: UploadAttendanceComponent;
  let fixture: ComponentFixture<UploadAttendanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UploadAttendanceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
