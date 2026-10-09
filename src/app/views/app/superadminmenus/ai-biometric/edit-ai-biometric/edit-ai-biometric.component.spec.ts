import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditAiBiometricComponent } from './edit-ai-biometric.component';

describe('EditAiBiometricComponent', () => {
  let component: EditAiBiometricComponent;
  let fixture: ComponentFixture<EditAiBiometricComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAiBiometricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAiBiometricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
