import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditOfficeExpenseCategoryComponent } from './edit-office-expense-category.component';

describe('EditOfficeExpenseCategoryComponent', () => {
  let component: EditOfficeExpenseCategoryComponent;
  let fixture: ComponentFixture<EditOfficeExpenseCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOfficeExpenseCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOfficeExpenseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
