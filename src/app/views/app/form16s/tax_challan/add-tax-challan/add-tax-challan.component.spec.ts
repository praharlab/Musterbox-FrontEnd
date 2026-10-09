import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddTaxChallanComponent } from './add-tax-challan.component';

describe('AddTaxChallanComponent', () => {
  let component: AddTaxChallanComponent;
  let fixture: ComponentFixture<AddTaxChallanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddTaxChallanComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaxChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
