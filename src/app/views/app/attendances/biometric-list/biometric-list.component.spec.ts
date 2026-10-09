import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BiometricListComponent } from './biometric-list.component';

describe('BiometricListComponent', () => {
  let component: BiometricListComponent;
  let fixture: ComponentFixture<BiometricListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BiometricListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiometricListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
