import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddExpenseHeadComponent } from './add-expense-head.component';

describe('AddExpenseHeadComponent', () => {
  let component: AddExpenseHeadComponent;
  let fixture: ComponentFixture<AddExpenseHeadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddExpenseHeadComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExpenseHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
