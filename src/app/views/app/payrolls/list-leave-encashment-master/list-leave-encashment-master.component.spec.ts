import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListLeaveEncashmentMasterComponent } from './list-leave-encashment-master.component';

describe('ListLeaveEncashmentMasterComponent', () => {
  let component: ListLeaveEncashmentMasterComponent;
  let fixture: ComponentFixture<ListLeaveEncashmentMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListLeaveEncashmentMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLeaveEncashmentMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
