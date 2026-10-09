import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListTaxRebateComponent } from './list-tax-rebate.component';

describe('ListTaxRebateComponent', () => {
  let component: ListTaxRebateComponent;
  let fixture: ComponentFixture<ListTaxRebateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTaxRebateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTaxRebateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
