import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InsideTrackingComponent } from './inside-tracking.component';

describe('InsideTrackingComponent', () => {
  let component: InsideTrackingComponent;
  let fixture: ComponentFixture<InsideTrackingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InsideTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsideTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
