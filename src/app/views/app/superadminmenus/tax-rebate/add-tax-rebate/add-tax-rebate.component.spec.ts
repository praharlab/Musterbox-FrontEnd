import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddTaxRebateComponent } from './add-tax-rebate.component';

describe('AddTaxRebateComponent', () => {
  let component: AddTaxRebateComponent;
  let fixture: ComponentFixture<AddTaxRebateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTaxRebateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaxRebateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
