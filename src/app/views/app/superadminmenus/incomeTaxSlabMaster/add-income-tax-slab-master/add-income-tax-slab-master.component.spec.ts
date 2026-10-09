import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddIncomeTaxSlabMasterComponent } from './add-income-tax-slab-master.component';

describe('AddIncomeTaxSlabMasterComponent', () => {
  let component: AddIncomeTaxSlabMasterComponent;
  let fixture: ComponentFixture<AddIncomeTaxSlabMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddIncomeTaxSlabMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncomeTaxSlabMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
