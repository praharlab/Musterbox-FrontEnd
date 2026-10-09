import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddTaxStandardDeductionComponent } from './add-tax-standard-deduction.component';

describe('AddTaxStandardDeductionComponent', () => {
  let component: AddTaxStandardDeductionComponent;
  let fixture: ComponentFixture<AddTaxStandardDeductionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTaxStandardDeductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaxStandardDeductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
