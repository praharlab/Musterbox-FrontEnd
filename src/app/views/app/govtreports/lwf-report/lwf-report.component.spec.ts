import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LwfReportComponent } from './lwf-report.component';

describe('LwfReportComponent', () => {
  let component: LwfReportComponent;
  let fixture: ComponentFixture<LwfReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LwfReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LwfReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
