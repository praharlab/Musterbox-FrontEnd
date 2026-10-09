import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkAddEmployeeFoodAllowancePolicyComponent } from './bulk-add-employee-food-allowance-policy.component';

describe('BulkAddEmployeeFoodAllowancePolicyComponent', () => {
  let component: BulkAddEmployeeFoodAllowancePolicyComponent;
  let fixture: ComponentFixture<BulkAddEmployeeFoodAllowancePolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkAddEmployeeFoodAllowancePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAddEmployeeFoodAllowancePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
