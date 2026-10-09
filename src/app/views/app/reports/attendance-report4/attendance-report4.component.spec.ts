import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AttendanceReport4Component } from './attendance-report4.component';

describe('AttendanceReport4Component', () => {
  let component: AttendanceReport4Component;
  let fixture: ComponentFixture<AttendanceReport4Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceReport4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceReport4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
