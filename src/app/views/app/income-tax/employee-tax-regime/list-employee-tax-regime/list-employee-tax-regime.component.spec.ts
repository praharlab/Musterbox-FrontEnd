import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeTaxRegimeComponent } from './list-employee-tax-regime.component';

describe('ListEmployeeTaxRegimeComponent', () => {
  let component: ListEmployeeTaxRegimeComponent;
  let fixture: ComponentFixture<ListEmployeeTaxRegimeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmployeeTaxRegimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeTaxRegimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
