import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListLeaveEncashmentComponent } from './list-leave-encashment.component';

describe('ListLeaveEncashmentComponent', () => {
  let component: ListLeaveEncashmentComponent;
  let fixture: ComponentFixture<ListLeaveEncashmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListLeaveEncashmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLeaveEncashmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
