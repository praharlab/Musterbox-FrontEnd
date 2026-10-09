import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeTrackingComponent } from './employee-tracking.component';

describe('EmployeeTrackingComponent', () => {
  let component: EmployeeTrackingComponent;
  let fixture: ComponentFixture<EmployeeTrackingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeTrackingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
