import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportOfficeExpenseCategoryComponent } from './import-office-expense-category.component';

describe('ImportOfficeExpenseCategoryComponent', () => {
  let component: ImportOfficeExpenseCategoryComponent;
  let fixture: ComponentFixture<ImportOfficeExpenseCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportOfficeExpenseCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportOfficeExpenseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
