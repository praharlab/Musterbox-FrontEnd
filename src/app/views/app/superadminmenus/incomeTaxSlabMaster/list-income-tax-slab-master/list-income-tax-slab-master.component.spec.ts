import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListIncomeTaxSlabMasterComponent } from './list-income-tax-slab-master.component';

describe('ListIncomeTaxSlabMasterComponent', () => {
  let component: ListIncomeTaxSlabMasterComponent;
  let fixture: ComponentFixture<ListIncomeTaxSlabMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListIncomeTaxSlabMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListIncomeTaxSlabMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
