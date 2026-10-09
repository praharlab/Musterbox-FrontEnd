import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OutsideTrackingComponent } from './outside-tracking.component';

describe('OutsideTrackingComponent', () => {
  let component: OutsideTrackingComponent;
  let fixture: ComponentFixture<OutsideTrackingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OutsideTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutsideTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
