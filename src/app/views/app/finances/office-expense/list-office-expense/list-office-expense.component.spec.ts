import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListOfficeExpenseComponent } from './list-office-expense.component';

describe('ListOfficeExpenseComponent', () => {
  let component: ListOfficeExpenseComponent;
  let fixture: ComponentFixture<ListOfficeExpenseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfficeExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfficeExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
