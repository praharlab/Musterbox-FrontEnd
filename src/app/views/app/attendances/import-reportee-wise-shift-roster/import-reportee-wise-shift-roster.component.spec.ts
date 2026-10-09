import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportReporteeWiseShiftRosterComponent } from './import-reportee-wise-shift-roster.component';

describe('ImportReporteeWiseShiftRosterComponent', () => {
  let component: ImportReporteeWiseShiftRosterComponent;
  let fixture: ComponentFixture<ImportReporteeWiseShiftRosterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportReporteeWiseShiftRosterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportReporteeWiseShiftRosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
