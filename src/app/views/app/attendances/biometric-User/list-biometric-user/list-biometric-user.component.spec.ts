import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListBiometricUserComponent } from './list-biometric-user.component';

describe('ListBiometricUserComponent', () => {
  let component: ListBiometricUserComponent;
  let fixture: ComponentFixture<ListBiometricUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBiometricUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBiometricUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
