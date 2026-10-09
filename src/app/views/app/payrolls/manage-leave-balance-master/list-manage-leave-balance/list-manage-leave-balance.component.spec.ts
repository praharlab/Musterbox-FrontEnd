import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListManageLeaveBalanceComponent } from './list-manage-leave-balance.component';

describe('ListManageLeaveBalanceComponent', () => {
  let component: ListManageLeaveBalanceComponent;
  let fixture: ComponentFixture<ListManageLeaveBalanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListManageLeaveBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListManageLeaveBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
