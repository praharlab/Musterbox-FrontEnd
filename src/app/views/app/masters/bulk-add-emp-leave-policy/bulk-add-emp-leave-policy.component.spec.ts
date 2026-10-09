import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkAddEmpLeavePolicyComponent } from './bulk-add-emp-leave-policy.component';

describe('BulkAddEmpLeavePolicyComponent', () => {
  let component: BulkAddEmpLeavePolicyComponent;
  let fixture: ComponentFixture<BulkAddEmpLeavePolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkAddEmpLeavePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAddEmpLeavePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
