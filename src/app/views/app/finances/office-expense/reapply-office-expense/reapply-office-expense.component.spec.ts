import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReapplyOfficeExpenseComponent } from './reapply-office-expense.component';

describe('ReapplyOfficeExpenseComponent', () => {
  let component: ReapplyOfficeExpenseComponent;
  let fixture: ComponentFixture<ReapplyOfficeExpenseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReapplyOfficeExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReapplyOfficeExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
