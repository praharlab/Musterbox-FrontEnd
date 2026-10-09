import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeResignationComponent } from './employee-resignation.component';

describe('EmployeeResignationComponent', () => {
  let component: EmployeeResignationComponent;
  let fixture: ComponentFixture<EmployeeResignationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeResignationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeResignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
