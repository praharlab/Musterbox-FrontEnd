import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GovReportMasterComponent } from './gov-report-master.component';

describe('GovReportMasterComponent', () => {
  let component: GovReportMasterComponent;
  let fixture: ComponentFixture<GovReportMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GovReportMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovReportMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
