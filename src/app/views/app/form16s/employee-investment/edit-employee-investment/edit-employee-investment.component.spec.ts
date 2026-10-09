import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditEmployeeInvestmentComponent } from './edit-employee-investment.component';

describe('EditEmployeeInvestmentComponent', () => {
  let component: EditEmployeeInvestmentComponent;
  let fixture: ComponentFixture<EditEmployeeInvestmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditEmployeeInvestmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployeeInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
