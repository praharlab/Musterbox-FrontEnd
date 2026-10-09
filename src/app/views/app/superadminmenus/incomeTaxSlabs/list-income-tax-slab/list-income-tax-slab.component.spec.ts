import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListIncomeTaxSlabComponent } from './list-income-tax-slab.component';

describe('ListIncomeTaxSlabComponent', () => {
  let component: ListIncomeTaxSlabComponent;
  let fixture: ComponentFixture<ListIncomeTaxSlabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListIncomeTaxSlabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListIncomeTaxSlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
