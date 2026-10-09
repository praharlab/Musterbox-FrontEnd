import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditEmployeeGatepassComponent } from './edit-employee-gatepass.component';

describe('EditEmployeeGatepassComponent', () => {
  let component: EditEmployeeGatepassComponent;
  let fixture: ComponentFixture<EditEmployeeGatepassComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEmployeeGatepassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployeeGatepassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
