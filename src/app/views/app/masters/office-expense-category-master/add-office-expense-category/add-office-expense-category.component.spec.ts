import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddOfficeExpenseCategoryComponent } from './add-office-expense-category.component';

describe('AddOfficeExpenseCategoryComponent', () => {
  let component: AddOfficeExpenseCategoryComponent;
  let fixture: ComponentFixture<AddOfficeExpenseCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOfficeExpenseCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOfficeExpenseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
