import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditIncomeTaxSlabMasterComponent } from './edit-income-tax-slab-master.component';

describe('EditIncomeTaxSlabMasterComponent', () => {
  let component: EditIncomeTaxSlabMasterComponent;
  let fixture: ComponentFixture<EditIncomeTaxSlabMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditIncomeTaxSlabMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIncomeTaxSlabMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
