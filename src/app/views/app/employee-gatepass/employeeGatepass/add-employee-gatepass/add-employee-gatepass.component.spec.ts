import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddEmployeeGatepassComponent } from './add-employee-gatepass.component';

describe('AddEmployeeGatepassComponent', () => {
  let component: AddEmployeeGatepassComponent;
  let fixture: ComponentFixture<AddEmployeeGatepassComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEmployeeGatepassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeGatepassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
