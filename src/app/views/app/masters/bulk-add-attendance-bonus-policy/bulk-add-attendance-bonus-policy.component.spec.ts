import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkAddAttendanceBonusPolicyComponent } from './bulk-add-attendance-bonus-policy.component';

describe('BulkAddAttendanceBonusPolicyComponent', () => {
  let component: BulkAddAttendanceBonusPolicyComponent;
  let fixture: ComponentFixture<BulkAddAttendanceBonusPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkAddAttendanceBonusPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAddAttendanceBonusPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
