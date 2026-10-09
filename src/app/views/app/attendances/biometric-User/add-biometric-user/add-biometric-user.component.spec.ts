import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddBiometricUserComponent } from './add-biometric-user.component';

describe('AddBiometricUserComponent', () => {
  let component: AddBiometricUserComponent;
  let fixture: ComponentFixture<AddBiometricUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBiometricUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBiometricUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
