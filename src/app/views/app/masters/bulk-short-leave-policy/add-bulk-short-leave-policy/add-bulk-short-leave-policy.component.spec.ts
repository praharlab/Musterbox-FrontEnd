import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddBulkShortLeavePolicyComponent } from './add-bulk-short-leave-policy.component';

describe('AddBulkShortLeavePolicyComponent', () => {
  let component: AddBulkShortLeavePolicyComponent;
  let fixture: ComponentFixture<AddBulkShortLeavePolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBulkShortLeavePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBulkShortLeavePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
