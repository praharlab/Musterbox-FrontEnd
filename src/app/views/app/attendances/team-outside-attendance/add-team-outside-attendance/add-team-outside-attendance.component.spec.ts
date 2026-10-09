import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddTeamOutsideAttendanceComponent } from './add-team-outside-attendance.component';

describe('AddTeamOutsideAttendanceComponent', () => {
  let component: AddTeamOutsideAttendanceComponent;
  let fixture: ComponentFixture<AddTeamOutsideAttendanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddTeamOutsideAttendanceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTeamOutsideAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
