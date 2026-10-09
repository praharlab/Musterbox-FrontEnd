import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditExpenseHeadComponent } from './edit-expense-head.component';

describe('EditExpenseHeadComponent', () => {
  let component: EditExpenseHeadComponent;
  let fixture: ComponentFixture<EditExpenseHeadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditExpenseHeadComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExpenseHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
