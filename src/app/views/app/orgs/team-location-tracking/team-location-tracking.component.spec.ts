import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamLocationTrackingComponent } from './team-location-tracking.component';

describe('TeamLocationTrackingComponent', () => {
  let component: TeamLocationTrackingComponent;
  let fixture: ComponentFixture<TeamLocationTrackingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TeamLocationTrackingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamLocationTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
