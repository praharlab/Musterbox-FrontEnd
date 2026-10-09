import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApprovedLeaveTransactionMasterComponent } from './approved-leave-transaction-master.component';

describe('ApprovedLeaveTransactionMasterComponent', () => {
  let component: ApprovedLeaveTransactionMasterComponent;
  let fixture: ComponentFixture<ApprovedLeaveTransactionMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovedLeaveTransactionMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedLeaveTransactionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
