import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddShortLeaveApplicationComponent } from './add-short-leave-application.component';

describe('AddShortLeaveApplicationComponent', () => {
  let component: AddShortLeaveApplicationComponent;
  let fixture: ComponentFixture<AddShortLeaveApplicationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddShortLeaveApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShortLeaveApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
