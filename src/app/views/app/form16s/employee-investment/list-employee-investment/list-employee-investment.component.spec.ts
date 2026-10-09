import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeInvestmentComponent } from './list-employee-investment.component';

describe('ListEmployeeInvestmentComponent', () => {
  let component: ListEmployeeInvestmentComponent;
  let fixture: ComponentFixture<ListEmployeeInvestmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeInvestmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
