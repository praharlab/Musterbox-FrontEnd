import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkAddAttendancepolicyComponent } from './bulk-add-attendancepolicy.component';

describe('BulkAddAttendancepolicyComponent', () => {
  let component: BulkAddAttendancepolicyComponent;
  let fixture: ComponentFixture<BulkAddAttendancepolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BulkAddAttendancepolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAddAttendancepolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
