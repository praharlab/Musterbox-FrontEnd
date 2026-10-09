import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OutdoorDutyApplicationReportComponent } from './outdoor-duty-application-report.component';

describe('OutdoorDutyApplicationReportComponent', () => {
  let component: OutdoorDutyApplicationReportComponent;
  let fixture: ComponentFixture<OutdoorDutyApplicationReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OutdoorDutyApplicationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutdoorDutyApplicationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
