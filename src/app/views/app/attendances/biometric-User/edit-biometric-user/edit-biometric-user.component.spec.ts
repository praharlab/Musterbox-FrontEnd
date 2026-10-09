import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditBiometricUserComponent } from './edit-biometric-user.component';

describe('EditBiometricUserComponent', () => {
  let component: EditBiometricUserComponent;
  let fixture: ComponentFixture<EditBiometricUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBiometricUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBiometricUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
