import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewOfficeExpenseCommonComponent } from './view-office-expense-common.component';

describe('ViewOfficeExpenseCommonComponent', () => {
  let component: ViewOfficeExpenseCommonComponent;
  let fixture: ComponentFixture<ViewOfficeExpenseCommonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewOfficeExpenseCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOfficeExpenseCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
