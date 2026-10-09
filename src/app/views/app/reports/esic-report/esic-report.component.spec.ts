import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EsicReportComponent } from './esic-report.component';

describe('EsicReportComponent', () => {
  let component: EsicReportComponent;
  let fixture: ComponentFixture<EsicReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EsicReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsicReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
