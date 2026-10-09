import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportExpenseCategoryComponent } from './import-expense-category.component';

describe('ImportExpenseCategoryComponent', () => {
  let component: ImportExpenseCategoryComponent;
  let fixture: ComponentFixture<ImportExpenseCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportExpenseCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportExpenseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
