import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddOfficeExpenseHeadComponent } from './add-office-expense-head.component';

describe('AddOfficeExpenseHeadComponent', () => {
  let component: AddOfficeExpenseHeadComponent;
  let fixture: ComponentFixture<AddOfficeExpenseHeadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOfficeExpenseHeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOfficeExpenseHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
