import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyLeaveBalanceComponent } from './my-leave-balance.component';

describe('MyLeaveBalanceComponent', () => {
  let component: MyLeaveBalanceComponent;
  let fixture: ComponentFixture<MyLeaveBalanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MyLeaveBalanceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyLeaveBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
