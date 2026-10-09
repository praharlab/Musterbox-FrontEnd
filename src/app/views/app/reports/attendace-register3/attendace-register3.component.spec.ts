import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AttendaceRegister3Component } from './attendace-register3.component';

describe('AttendaceRegister3Component', () => {
  let component: AttendaceRegister3Component;
  let fixture: ComponentFixture<AttendaceRegister3Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendaceRegister3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendaceRegister3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
