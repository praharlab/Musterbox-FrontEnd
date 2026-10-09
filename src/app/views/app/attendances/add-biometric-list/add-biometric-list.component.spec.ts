import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddBiometricListComponent } from './add-biometric-list.component';

describe('AddBiometricListComponent', () => {
  let component: AddBiometricListComponent;
  let fixture: ComponentFixture<AddBiometricListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBiometricListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBiometricListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
