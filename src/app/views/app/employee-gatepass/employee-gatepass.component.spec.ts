import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeGatepassComponent } from './employee-gatepass.component';

describe('EmployeeGatepassComponent', () => {
  let component: EmployeeGatepassComponent;
  let fixture: ComponentFixture<EmployeeGatepassComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeGatepassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeGatepassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
