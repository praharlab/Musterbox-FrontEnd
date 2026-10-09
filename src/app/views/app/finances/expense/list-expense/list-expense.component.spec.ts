import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListExpenseComponent } from './list-expense.component';

describe('ListExpenseComponent', () => {
  let component: ListExpenseComponent;
  let fixture: ComponentFixture<ListExpenseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListExpenseComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
