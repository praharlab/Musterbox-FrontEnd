import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyOutsideAttendanceComponent } from './my-outside-attendance.component';

describe('MyOutsideAttendanceComponent', () => {
  let component: MyOutsideAttendanceComponent;
  let fixture: ComponentFixture<MyOutsideAttendanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MyOutsideAttendanceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOutsideAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
