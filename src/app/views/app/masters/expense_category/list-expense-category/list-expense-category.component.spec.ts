import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListExpenseCategoryComponent } from './list-expense-category.component';

describe('ListExpenseCategoryComponent', () => {
  let component: ListExpenseCategoryComponent;
  let fixture: ComponentFixture<ListExpenseCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListExpenseCategoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListExpenseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
