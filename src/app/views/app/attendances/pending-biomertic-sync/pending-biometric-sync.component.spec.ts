import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PendingBiometricSyncComponent } from './pending-biometric-sync.component';

describe('PendingBiomerticSyncComponent', () => {
  let component: PendingBiometricSyncComponent;
  let fixture: ComponentFixture<PendingBiometricSyncComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PendingBiometricSyncComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingBiometricSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
