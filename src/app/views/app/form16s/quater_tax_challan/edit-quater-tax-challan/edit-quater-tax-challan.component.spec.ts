import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditQuaterTaxChallanComponent } from './edit-quater-tax-challan.component';

describe('EditQuaterTaxChallanComponent', () => {
  let component: EditQuaterTaxChallanComponent;
  let fixture: ComponentFixture<EditQuaterTaxChallanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditQuaterTaxChallanComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditQuaterTaxChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
