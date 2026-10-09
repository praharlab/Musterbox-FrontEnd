import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditTaxRebateComponent } from './edit-tax-rebate.component';

describe('EditTaxRebateComponent', () => {
  let component: EditTaxRebateComponent;
  let fixture: ComponentFixture<EditTaxRebateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTaxRebateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTaxRebateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
