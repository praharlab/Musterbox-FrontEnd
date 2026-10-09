import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkAddEmployeeLateEarlyPolicyComponent } from './bulk-add-employee-late-early-policy.component';

describe('BulkAddEmployeeLateEarlyPolicyComponent', () => {
  let component: BulkAddEmployeeLateEarlyPolicyComponent;
  let fixture: ComponentFixture<BulkAddEmployeeLateEarlyPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkAddEmployeeLateEarlyPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAddEmployeeLateEarlyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
