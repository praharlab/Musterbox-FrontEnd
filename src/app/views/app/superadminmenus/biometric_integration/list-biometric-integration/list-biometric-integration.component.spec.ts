import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListBiometricIntegrationComponent } from './list-biometric-integration.component';

describe('ListBiometricIntegrationComponent', () => {
  let component: ListBiometricIntegrationComponent;
  let fixture: ComponentFixture<ListBiometricIntegrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListBiometricIntegrationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBiometricIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
