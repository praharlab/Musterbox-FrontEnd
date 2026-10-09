import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DistinctLocationsTrackingReportComponent } from './distinct-locations-tracking-report.component';

describe('DistinctLoationsTrackingReportComponent', () => {
  let component: DistinctLocationsTrackingReportComponent;
  let fixture: ComponentFixture<DistinctLocationsTrackingReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DistinctLocationsTrackingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistinctLocationsTrackingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
