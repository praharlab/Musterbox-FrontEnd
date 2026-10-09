import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeStatusComponent } from './employee-status.component';

describe('EmployeeStatusComponent', () => {
  let component: EmployeeStatusComponent;
  let fixture: ComponentFixture<EmployeeStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeStatusComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
