import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListExpenseHeadComponent } from './list-expense-head.component';

describe('ListExpenseHeadComponent', () => {
  let component: ListExpenseHeadComponent;
  let fixture: ComponentFixture<ListExpenseHeadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListExpenseHeadComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListExpenseHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
