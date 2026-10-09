import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkInitialLeaveOpeingBalanceComponent } from './bulk-initial-leave-opeing-balance.component';

describe('BulkInitialLeaveOpeingBalanceComponent', () => {
  let component: BulkInitialLeaveOpeingBalanceComponent;
  let fixture: ComponentFixture<BulkInitialLeaveOpeingBalanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkInitialLeaveOpeingBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkInitialLeaveOpeingBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
