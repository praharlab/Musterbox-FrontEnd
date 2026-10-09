import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddExpenseCategoryComponent } from './add-expense-category.component';

describe('AddExpenseCategoryComponent', () => {
  let component: AddExpenseCategoryComponent;
  let fixture: ComponentFixture<AddExpenseCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddExpenseCategoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExpenseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
