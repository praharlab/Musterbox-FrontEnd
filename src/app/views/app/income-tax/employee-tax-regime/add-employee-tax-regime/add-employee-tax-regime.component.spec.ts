import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddEmployeeTaxRegimeComponent } from './add-employee-tax-regime.component';

describe('AddEmployeeTaxRegimeComponent', () => {
  let component: AddEmployeeTaxRegimeComponent;
  let fixture: ComponentFixture<AddEmployeeTaxRegimeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEmployeeTaxRegimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeTaxRegimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
