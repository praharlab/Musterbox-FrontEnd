import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddEmployeeInvestmentComponent } from './add-employee-investment.component';

describe('AddEmployeeInvestmentComponent', () => {
  let component: AddEmployeeInvestmentComponent;
  let fixture: ComponentFixture<AddEmployeeInvestmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddEmployeeInvestmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
