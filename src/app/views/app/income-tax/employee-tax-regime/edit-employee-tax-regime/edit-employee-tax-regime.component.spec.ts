import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditEmployeeTaxRegimeComponent } from './edit-employee-tax-regime.component';

describe('EditEmployeeTaxRegimeComponent', () => {
  let component: EditEmployeeTaxRegimeComponent;
  let fixture: ComponentFixture<EditEmployeeTaxRegimeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEmployeeTaxRegimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployeeTaxRegimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
