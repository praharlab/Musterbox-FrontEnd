import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddLeaveBalanceComponent } from './add-leave-balance.component';

describe('AddLeaveBalanceComponent', () => {
  let component: AddLeaveBalanceComponent;
  let fixture: ComponentFixture<AddLeaveBalanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddLeaveBalanceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLeaveBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
