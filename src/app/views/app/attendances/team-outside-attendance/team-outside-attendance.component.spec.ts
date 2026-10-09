import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamOutsideAttendanceComponent } from './team-outside-attendance.component';

describe('TeamOutsideAttendanceComponent', () => {
  let component: TeamOutsideAttendanceComponent;
  let fixture: ComponentFixture<TeamOutsideAttendanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TeamOutsideAttendanceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamOutsideAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
