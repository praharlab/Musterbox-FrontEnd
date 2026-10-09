import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompletedTenureReportComponent } from './completed-tenure-report.component';

describe('CompletedTenureReportComponent', () => {
  let component: CompletedTenureReportComponent;
  let fixture: ComponentFixture<CompletedTenureReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletedTenureReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedTenureReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
