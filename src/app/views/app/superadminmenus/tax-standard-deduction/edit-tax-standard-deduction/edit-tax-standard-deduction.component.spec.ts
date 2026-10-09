import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditTaxStandardDeductionComponent } from './edit-tax-standard-deduction.component';

describe('EditTaxStandardDeductionComponent', () => {
  let component: EditTaxStandardDeductionComponent;
  let fixture: ComponentFixture<EditTaxStandardDeductionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTaxStandardDeductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTaxStandardDeductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
