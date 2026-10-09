import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewExpenseCommonComponent } from './view-expense-common.component';

describe('ViewExpenseCommonComponent', () => {
  let component: ViewExpenseCommonComponent;
  let fixture: ComponentFixture<ViewExpenseCommonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewExpenseCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExpenseCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
