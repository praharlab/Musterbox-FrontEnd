import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListTaxStandardDeductionComponent } from './list-tax-standard-deduction.component';

describe('ListTaxStandardDeductionComponent', () => {
  let component: ListTaxStandardDeductionComponent;
  let fixture: ComponentFixture<ListTaxStandardDeductionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTaxStandardDeductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTaxStandardDeductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
