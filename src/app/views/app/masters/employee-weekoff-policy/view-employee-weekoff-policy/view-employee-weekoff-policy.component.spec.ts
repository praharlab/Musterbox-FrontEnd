import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewEmployeeWeekoffPolicyComponent } from './view-employee-weekoff-policy.component';

describe('ViewEmployeeWeekoffPolicyComponent', () => {
  let component: ViewEmployeeWeekoffPolicyComponent;
  let fixture: ComponentFixture<ViewEmployeeWeekoffPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEmployeeWeekoffPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEmployeeWeekoffPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
