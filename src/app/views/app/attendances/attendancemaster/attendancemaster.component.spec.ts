import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AttendancemasterComponent } from './attendancemaster.component';

describe('AttendancemasterComponent', () => {
  let component: AttendancemasterComponent;
  let fixture: ComponentFixture<AttendancemasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AttendancemasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendancemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
