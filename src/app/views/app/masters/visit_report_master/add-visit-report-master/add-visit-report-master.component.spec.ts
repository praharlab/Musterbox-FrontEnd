import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddVisitReportMasterComponent } from './add-visit-report-master.component';

describe('AddVisitReportMasterComponent', () => {
  let component: AddVisitReportMasterComponent;
  let fixture: ComponentFixture<AddVisitReportMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddVisitReportMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVisitReportMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
