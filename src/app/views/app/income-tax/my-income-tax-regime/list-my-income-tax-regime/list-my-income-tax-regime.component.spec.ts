import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListMyIncomeTaxRegimeComponent } from './list-my-income-tax-regime.component';

describe('ListMyIncomeTaxRegimeComponent', () => {
  let component: ListMyIncomeTaxRegimeComponent;
  let fixture: ComponentFixture<ListMyIncomeTaxRegimeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMyIncomeTaxRegimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMyIncomeTaxRegimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
