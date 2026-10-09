import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddOfficeExpenseComponent } from './add-office-expense.component';

describe('AddOfficeExpenseComponent', () => {
  let component: AddOfficeExpenseComponent;
  let fixture: ComponentFixture<AddOfficeExpenseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOfficeExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOfficeExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
