import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AttendanceVerifiedComponent } from './attendance-verified.component';

describe('AttendanceVerifiedComponent', () => {
  let component: AttendanceVerifiedComponent;
  let fixture: ComponentFixture<AttendanceVerifiedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AttendanceVerifiedComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceVerifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
