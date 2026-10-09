import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrackingDashboardMasterComponent } from './tracking-dashboard-master.component';

describe('TrackingDashboardMasterComponent', () => {
  let component: TrackingDashboardMasterComponent;
  let fixture: ComponentFixture<TrackingDashboardMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackingDashboardMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingDashboardMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
