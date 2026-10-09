import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UnassignedBiometricCodeComponent } from './unassigned-biometric-code.component';

describe('UnassignedBiometricCodeComponent', () => {
  let component: UnassignedBiometricCodeComponent;
  let fixture: ComponentFixture<UnassignedBiometricCodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UnassignedBiometricCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnassignedBiometricCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
