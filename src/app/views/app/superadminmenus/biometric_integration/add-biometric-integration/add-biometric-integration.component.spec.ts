import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddBiometricIntegrationComponent } from './add-biometric-integration.component';

describe('AddBiometricIntegrationComponent', () => {
  let component: AddBiometricIntegrationComponent;
  let fixture: ComponentFixture<AddBiometricIntegrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddBiometricIntegrationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBiometricIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
