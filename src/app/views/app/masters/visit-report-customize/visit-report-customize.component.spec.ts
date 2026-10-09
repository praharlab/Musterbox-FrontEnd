import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VisitReportCustomizeComponent } from './visit-report-customize.component';

describe('VisitReportCustomizeComponent', () => {
  let component: VisitReportCustomizeComponent;
  let fixture: ComponentFixture<VisitReportCustomizeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VisitReportCustomizeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitReportCustomizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
