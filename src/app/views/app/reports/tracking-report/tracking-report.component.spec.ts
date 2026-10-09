import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrackingReportComponent } from './tracking-report.component';

describe('TrackingReportComponent', () => {
  let component: TrackingReportComponent;
  let fixture: ComponentFixture<TrackingReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TrackingReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
