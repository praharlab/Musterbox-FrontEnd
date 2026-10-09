import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KmReportComponent } from './km-report.component';

describe('KmReportComponent', () => {
  let component: KmReportComponent;
  let fixture: ComponentFixture<KmReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [KmReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KmReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
