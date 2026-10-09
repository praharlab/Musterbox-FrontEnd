import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyShortLeaveApplicationComponent } from './my-short-leave-application.component';

describe('MyShortLeaveApplicationComponent', () => {
  let component: MyShortLeaveApplicationComponent;
  let fixture: ComponentFixture<MyShortLeaveApplicationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyShortLeaveApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyShortLeaveApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
