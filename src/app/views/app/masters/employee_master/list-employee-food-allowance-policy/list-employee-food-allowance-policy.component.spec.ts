import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeFoodAllowancePolicyComponent } from './list-employee-food-allowance-policy.component';

describe('ListEmployeeFoodAllowancePolicyComponent', () => {
  let component: ListEmployeeFoodAllowancePolicyComponent;
  let fixture: ComponentFixture<ListEmployeeFoodAllowancePolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmployeeFoodAllowancePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeFoodAllowancePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
