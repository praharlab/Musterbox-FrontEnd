import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewVisitReportMasterComponent } from './view-visit-report-master.component';

describe('ViewVisitReportMasterComponent', () => {
  let component: ViewVisitReportMasterComponent;
  let fixture: ComponentFixture<ViewVisitReportMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ViewVisitReportMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVisitReportMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
