import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeDeclarationReportComponent } from './employee-declaration-report.component';

describe('EmployeeDeclarationReportComponent', () => {
  let component: EmployeeDeclarationReportComponent;
  let fixture: ComponentFixture<EmployeeDeclarationReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeDeclarationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDeclarationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
