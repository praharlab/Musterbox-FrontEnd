import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewEmployeeFoodAllowancePolicyComponent } from './view-employee-food-allowance-policy.component';

describe('ViewEmployeeFoodAllowancePolicyComponent', () => {
  let component: ViewEmployeeFoodAllowancePolicyComponent;
  let fixture: ComponentFixture<ViewEmployeeFoodAllowancePolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEmployeeFoodAllowancePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEmployeeFoodAllowancePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
