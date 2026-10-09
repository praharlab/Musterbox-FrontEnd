import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeGatepassMasterComponent } from './employee-gatepass-master.component';

describe('EmployeeGatepassMasterComponent', () => {
  let component: EmployeeGatepassMasterComponent;
  let fixture: ComponentFixture<EmployeeGatepassMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeGatepassMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeGatepassMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
