import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssignBiometricUserListComponent } from './assign-biometric-user-list.component';

describe('AssignBiometricUserListComponent', () => {
  let component: AssignBiometricUserListComponent;
  let fixture: ComponentFixture<AssignBiometricUserListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignBiometricUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignBiometricUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
