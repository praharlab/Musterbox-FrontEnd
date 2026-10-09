import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NdaReportComponent } from './nda-report.component';

describe('NdaReportComponent', () => {
  let component: NdaReportComponent;
  let fixture: ComponentFixture<NdaReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NdaReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NdaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
