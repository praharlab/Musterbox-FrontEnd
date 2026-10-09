import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BiometricAttendanceSyncComponent } from './biometric-attendance-sync.component';

describe('BiometricAttendanceSyncComponent', () => {
  let component: BiometricAttendanceSyncComponent;
  let fixture: ComponentFixture<BiometricAttendanceSyncComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BiometricAttendanceSyncComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiometricAttendanceSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
