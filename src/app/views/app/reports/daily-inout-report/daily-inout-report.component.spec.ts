import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DailyInoutReportComponent } from './daily-inout-report.component';

describe('DailyInoutReportComponent', () => {
  let component: DailyInoutReportComponent;
  let fixture: ComponentFixture<DailyInoutReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyInoutReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyInoutReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
