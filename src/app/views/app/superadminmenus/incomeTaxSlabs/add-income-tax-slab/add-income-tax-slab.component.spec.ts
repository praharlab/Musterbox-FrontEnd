import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddIncomeTaxSlabComponent } from './add-income-tax-slab.component';

describe('AddIncomeTaxSlabComponent', () => {
  let component: AddIncomeTaxSlabComponent;
  let fixture: ComponentFixture<AddIncomeTaxSlabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddIncomeTaxSlabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncomeTaxSlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
