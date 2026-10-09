import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadBiometricAttendanceComponent } from './upload-biometric-attendance.component';

describe('UploadBiometricAttendanceComponent', () => {
  let component: UploadBiometricAttendanceComponent;
  let fixture: ComponentFixture<UploadBiometricAttendanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadBiometricAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadBiometricAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
