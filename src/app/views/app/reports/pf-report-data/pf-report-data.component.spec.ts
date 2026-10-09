import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PFReportDataComponent } from './pf-report-data.component';

describe('PFReportDataComponent', () => {
  let component: PFReportDataComponent;
  let fixture: ComponentFixture<PFReportDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PFReportDataComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PFReportDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
