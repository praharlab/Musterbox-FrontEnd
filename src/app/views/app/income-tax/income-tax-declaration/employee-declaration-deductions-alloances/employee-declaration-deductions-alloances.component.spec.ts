import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeDeclarationDeductionsAlloancesComponent } from './employee-declaration-deductions-alloances.component';

describe('EmployeeDeclarationDeductionsAlloancesComponent', () => {
  let component: EmployeeDeclarationDeductionsAlloancesComponent;
  let fixture: ComponentFixture<EmployeeDeclarationDeductionsAlloancesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeDeclarationDeductionsAlloancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDeclarationDeductionsAlloancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
