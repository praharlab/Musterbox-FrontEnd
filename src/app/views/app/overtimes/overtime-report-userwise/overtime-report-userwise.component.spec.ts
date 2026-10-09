import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OvertimeReportUserwiseComponent } from './overtime-report-userwise.component';

describe('OvertimeReportUserwiseComponent', () => {
  let component: OvertimeReportUserwiseComponent;
  let fixture: ComponentFixture<OvertimeReportUserwiseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OvertimeReportUserwiseComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvertimeReportUserwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
