import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AiBiometricComponent } from './ai-biometric.component';

describe('AiBiometricComponent', () => {
  let component: AiBiometricComponent;
  let fixture: ComponentFixture<AiBiometricComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AiBiometricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AiBiometricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
