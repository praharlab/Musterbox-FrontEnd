import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeIncomeTaxDeclarationComponent } from './employee-income-tax-declaration.component';

describe('EmployeeIncomeTaxDeclarationComponent', () => {
  let component: EmployeeIncomeTaxDeclarationComponent;
  let fixture: ComponentFixture<EmployeeIncomeTaxDeclarationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeIncomeTaxDeclarationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeIncomeTaxDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
