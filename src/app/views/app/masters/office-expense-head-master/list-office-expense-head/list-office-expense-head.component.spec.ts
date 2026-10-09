import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListOfficeExpenseHeadComponent } from './list-office-expense-head.component';

describe('ListOfficeExpenseHeadComponent', () => {
  let component: ListOfficeExpenseHeadComponent;
  let fixture: ComponentFixture<ListOfficeExpenseHeadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfficeExpenseHeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfficeExpenseHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
