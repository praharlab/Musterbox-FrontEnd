import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddMyIncomeTaxRegimeComponent } from './add-my-income-tax-regime.component';

describe('AddMyIncomeTaxRegimeComponent', () => {
  let component: AddMyIncomeTaxRegimeComponent;
  let fixture: ComponentFixture<AddMyIncomeTaxRegimeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMyIncomeTaxRegimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMyIncomeTaxRegimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
