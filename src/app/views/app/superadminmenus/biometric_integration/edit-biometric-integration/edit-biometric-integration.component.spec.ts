import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditBiometricIntegrationComponent } from './edit-biometric-integration.component';

describe('EditBiometricIntegrationComponent', () => {
  let component: EditBiometricIntegrationComponent;
  let fixture: ComponentFixture<EditBiometricIntegrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditBiometricIntegrationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBiometricIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
