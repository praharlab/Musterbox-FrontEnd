import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditTeamOutsideAttendanceComponent } from './edit-team-outside-attendance.component';

describe('EditTeamOutsideAttendanceComponent', () => {
  let component: EditTeamOutsideAttendanceComponent;
  let fixture: ComponentFixture<EditTeamOutsideAttendanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditTeamOutsideAttendanceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTeamOutsideAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
