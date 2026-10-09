import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditIncomeTaxSlabComponent } from './edit-income-tax-slab.component';

describe('EditIncomeTaxSlabComponent', () => {
  let component: EditIncomeTaxSlabComponent;
  let fixture: ComponentFixture<EditIncomeTaxSlabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditIncomeTaxSlabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIncomeTaxSlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
