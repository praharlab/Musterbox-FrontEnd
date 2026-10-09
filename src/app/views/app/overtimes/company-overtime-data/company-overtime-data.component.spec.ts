import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyOvertimeDataComponent } from './company-overtime-data.component';

describe('CompanyOvertimeDataComponent', () => {
  let component: CompanyOvertimeDataComponent;
  let fixture: ComponentFixture<CompanyOvertimeDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyOvertimeDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyOvertimeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
