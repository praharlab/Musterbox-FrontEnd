import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListTaxChallanComponent } from './list-tax-challan.component';

describe('ListTaxChallanComponent', () => {
  let component: ListTaxChallanComponent;
  let fixture: ComponentFixture<ListTaxChallanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListTaxChallanComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTaxChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
