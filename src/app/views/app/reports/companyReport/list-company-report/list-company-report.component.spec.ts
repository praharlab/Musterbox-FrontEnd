import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListCompanyReportComponent } from './list-company-report.component';

describe('ListCompanyReportComponent', () => {
  let component: ListCompanyReportComponent;
  let fixture: ComponentFixture<ListCompanyReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListCompanyReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCompanyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
