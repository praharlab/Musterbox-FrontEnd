import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddCompanyReportComponent } from './add-company-report.component';

describe('AddCompanyReportComponent', () => {
  let component: AddCompanyReportComponent;
  let fixture: ComponentFixture<AddCompanyReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddCompanyReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompanyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
