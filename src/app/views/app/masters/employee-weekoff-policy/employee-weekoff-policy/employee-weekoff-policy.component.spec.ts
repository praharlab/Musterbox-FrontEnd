import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeWeekoffPolicyComponent } from './employee-weekoff-policy.component';

describe('EmployeeWeekoffPolicyComponent', () => {
  let component: EmployeeWeekoffPolicyComponent;
  let fixture: ComponentFixture<EmployeeWeekoffPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeWeekoffPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeWeekoffPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
