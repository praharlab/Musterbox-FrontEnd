import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditOfficeExpenseHeadComponent } from './edit-office-expense-head.component';

describe('EditOfficeExpenseHeadComponent', () => {
  let component: EditOfficeExpenseHeadComponent;
  let fixture: ComponentFixture<EditOfficeExpenseHeadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOfficeExpenseHeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOfficeExpenseHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
