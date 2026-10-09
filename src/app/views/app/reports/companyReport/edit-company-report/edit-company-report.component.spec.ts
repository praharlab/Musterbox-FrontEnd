import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditCompanyReportComponent } from './edit-company-report.component';

describe('EditCompanyReportComponent', () => {
  let component: EditCompanyReportComponent;
  let fixture: ComponentFixture<EditCompanyReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditCompanyReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCompanyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
