import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddEmployeeLeavePolicyComponent } from './add-employee-leave-policy.component';

describe('AddEmployeeLeavePolicyComponent', () => {
  let component: AddEmployeeLeavePolicyComponent;
  let fixture: ComponentFixture<AddEmployeeLeavePolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEmployeeLeavePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeLeavePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
