import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SentimentsReportComponent } from './sentiments-report.component';

describe('SentimentsReportComponent', () => {
  let component: SentimentsReportComponent;
  let fixture: ComponentFixture<SentimentsReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SentimentsReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentimentsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
