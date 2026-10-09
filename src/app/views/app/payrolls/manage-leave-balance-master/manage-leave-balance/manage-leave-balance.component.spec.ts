import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageLeaveBalanceComponent } from './manage-leave-balance.component';

describe('ManageLeaveBalanceComponent', () => {
  let component: ManageLeaveBalanceComponent;
  let fixture: ComponentFixture<ManageLeaveBalanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageLeaveBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLeaveBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
