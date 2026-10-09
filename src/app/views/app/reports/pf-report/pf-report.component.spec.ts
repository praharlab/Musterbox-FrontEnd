import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PfReportComponent } from './pf-report.component';

describe('PfReportComponent', () => {
  let component: PfReportComponent;
  let fixture: ComponentFixture<PfReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PfReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PfReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
