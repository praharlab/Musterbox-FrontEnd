import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeIncomeFromOtherSourcesComponent } from './employee-income-from-other-sources.component';

describe('EmployeeIncomeFromOtherSourcesComponent', () => {
  let component: EmployeeIncomeFromOtherSourcesComponent;
  let fixture: ComponentFixture<EmployeeIncomeFromOtherSourcesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeIncomeFromOtherSourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeIncomeFromOtherSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
