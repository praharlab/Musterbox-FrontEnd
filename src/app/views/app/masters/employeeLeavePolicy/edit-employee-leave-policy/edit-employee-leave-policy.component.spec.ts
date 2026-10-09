import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditEmployeeLeavePolicyComponent } from './edit-employee-leave-policy.component';

describe('EditEmployeeLeavePolicyComponent', () => {
  let component: EditEmployeeLeavePolicyComponent;
  let fixture: ComponentFixture<EditEmployeeLeavePolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEmployeeLeavePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployeeLeavePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
