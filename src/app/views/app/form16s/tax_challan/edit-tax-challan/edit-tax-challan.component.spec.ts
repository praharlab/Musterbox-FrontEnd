import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditTaxChallanComponent } from './edit-tax-challan.component';

describe('EditTaxChallanComponent', () => {
  let component: EditTaxChallanComponent;
  let fixture: ComponentFixture<EditTaxChallanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditTaxChallanComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTaxChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
