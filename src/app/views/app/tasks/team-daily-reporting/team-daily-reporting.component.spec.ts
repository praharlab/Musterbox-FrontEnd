import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamDailyReportComponent } from './team-daily-reporting.component';

describe('TeamDailyReportComponent', () => {
  let component: TeamDailyReportComponent;
  let fixture: ComponentFixture<TeamDailyReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TeamDailyReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamDailyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
