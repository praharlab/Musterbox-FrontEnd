import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddQuaterTaxChallanComponent } from './add-quater-tax-challan.component';

describe('AddQuaterTaxChallanComponent', () => {
  let component: AddQuaterTaxChallanComponent;
  let fixture: ComponentFixture<AddQuaterTaxChallanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddQuaterTaxChallanComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddQuaterTaxChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
