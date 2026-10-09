import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MannualAttendanceComponent } from './mannual-attendance.component';

describe('MannualAttendanceComponent', () => {
  let component: MannualAttendanceComponent;
  let fixture: ComponentFixture<MannualAttendanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MannualAttendanceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MannualAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
