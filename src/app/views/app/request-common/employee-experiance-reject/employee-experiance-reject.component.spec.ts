import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeExperianceRejectComponent } from './employee-experiance-reject.component';

describe('EmployeeExperianceRejectComponent', () => {
  let component: EmployeeExperianceRejectComponent;
  let fixture: ComponentFixture<EmployeeExperianceRejectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeExperianceRejectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeExperianceRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
