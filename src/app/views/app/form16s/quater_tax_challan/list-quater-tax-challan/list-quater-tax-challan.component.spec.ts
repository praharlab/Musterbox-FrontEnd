import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListQuaterTaxChallanComponent } from './list-quater-tax-challan.component';

describe('ListQuaterTaxChallanComponent', () => {
  let component: ListQuaterTaxChallanComponent;
  let fixture: ComponentFixture<ListQuaterTaxChallanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListQuaterTaxChallanComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListQuaterTaxChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
