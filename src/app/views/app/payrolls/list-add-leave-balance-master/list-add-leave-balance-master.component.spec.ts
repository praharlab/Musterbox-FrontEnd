import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListAddLeaveBalanceMasterComponent } from './list-add-leave-balance-master.component';

describe('ListAddLeaveBalanceMasterComponent', () => {
  let component: ListAddLeaveBalanceMasterComponent;
  let fixture: ComponentFixture<ListAddLeaveBalanceMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAddLeaveBalanceMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAddLeaveBalanceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
