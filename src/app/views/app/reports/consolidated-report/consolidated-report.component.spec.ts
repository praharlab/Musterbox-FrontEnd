import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConsolidatedReportComponent } from './consolidated-report.component';

describe('ConsolidatedReportComponent', () => {
  let component: ConsolidatedReportComponent;
  let fixture: ComponentFixture<ConsolidatedReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConsolidatedReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidatedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
