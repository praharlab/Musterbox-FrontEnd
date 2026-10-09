import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OvertimeConsolidateReportComponent } from './overtime-consolidate-report.component';

describe('OvertimeConsolidateReportComponent', () => {
  let component: OvertimeConsolidateReportComponent;
  let fixture: ComponentFixture<OvertimeConsolidateReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OvertimeConsolidateReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvertimeConsolidateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
