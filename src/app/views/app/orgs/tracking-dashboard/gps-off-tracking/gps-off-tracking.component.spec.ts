import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GpsOffTrackingComponent } from './gps-off-tracking.component';

describe('GpsOffTrackingComponent', () => {
  let component: GpsOffTrackingComponent;
  let fixture: ComponentFixture<GpsOffTrackingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GpsOffTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpsOffTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
