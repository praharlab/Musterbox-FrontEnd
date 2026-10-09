import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditOfficeExpenseComponent } from './edit-office-expense.component';

describe('EditOfficeExpenseComponent', () => {
  let component: EditOfficeExpenseComponent;
  let fixture: ComponentFixture<EditOfficeExpenseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOfficeExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOfficeExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
