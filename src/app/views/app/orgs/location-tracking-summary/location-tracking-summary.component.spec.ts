import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LocationTrackingSummaryComponent } from './location-tracking-summary.component';

describe('LocationTrackingSummaryComponent', () => {
  let component: LocationTrackingSummaryComponent;
  let fixture: ComponentFixture<LocationTrackingSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationTrackingSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationTrackingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
