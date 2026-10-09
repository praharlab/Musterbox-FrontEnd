import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAiBiometricComponent } from './add-ai-biometric.component';

describe('AddAiBiometricComponent', () => {
  let component: AddAiBiometricComponent;
  let fixture: ComponentFixture<AddAiBiometricComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAiBiometricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAiBiometricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
