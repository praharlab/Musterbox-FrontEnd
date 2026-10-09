import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OtReportWithEsicComponent } from './ot-report-with-esic.component';

describe('OtReportWithEsicComponent', () => {
  let component: OtReportWithEsicComponent;
  let fixture: ComponentFixture<OtReportWithEsicComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OtReportWithEsicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtReportWithEsicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
