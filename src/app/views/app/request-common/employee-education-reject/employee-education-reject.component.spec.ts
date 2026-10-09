import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeEducationRejectComponent } from './employee-education-reject.component';

describe('EmployeeEducationRejectComponent', () => {
  let component: EmployeeEducationRejectComponent;
  let fixture: ComponentFixture<EmployeeEducationRejectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeEducationRejectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeEducationRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
