import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewAttendanceBonusPolicyComponent } from './view-attendance-bonus-policy.component';

describe('ViewAttendanceBonusPolicyComponent', () => {
  let component: ViewAttendanceBonusPolicyComponent;
  let fixture: ComponentFixture<ViewAttendanceBonusPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAttendanceBonusPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAttendanceBonusPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
