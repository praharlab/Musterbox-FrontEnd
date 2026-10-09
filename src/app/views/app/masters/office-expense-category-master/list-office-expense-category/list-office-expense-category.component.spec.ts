import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListOfficeExpenseCategoryComponent } from './list-office-expense-category.component';

describe('ListOfficeExpenseCategoryComponent', () => {
  let component: ListOfficeExpenseCategoryComponent;
  let fixture: ComponentFixture<ListOfficeExpenseCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfficeExpenseCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfficeExpenseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
