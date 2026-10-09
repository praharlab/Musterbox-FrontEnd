import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfflineTrackingComponent } from './offline-tracking.component';

describe('OfflineTrackingComponent', () => {
  let component: OfflineTrackingComponent;
  let fixture: ComponentFixture<OfflineTrackingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
