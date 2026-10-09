import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReporteeWiseShiftRosterComponent } from './reportee-wise-shift-roster.component';

describe('ReporteeWiseShiftRosterComponent', () => {
  let component: ReporteeWiseShiftRosterComponent;
  let fixture: ComponentFixture<ReporteeWiseShiftRosterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteeWiseShiftRosterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteeWiseShiftRosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
