import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DailyOtReportComponent } from './daily-ot-report.component';

describe('DailyOtReportComponent', () => {
  let component: DailyOtReportComponent;
  let fixture: ComponentFixture<DailyOtReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyOtReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyOtReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
