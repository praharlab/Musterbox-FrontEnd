import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditExpenseCategoryComponent } from './edit-expense-category.component';

describe('EditExpenseCategoryComponent', () => {
  let component: EditExpenseCategoryComponent;
  let fixture: ComponentFixture<EditExpenseCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditExpenseCategoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExpenseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
