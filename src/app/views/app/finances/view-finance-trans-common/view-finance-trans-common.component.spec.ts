import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewFinanceTransCommonComponent } from './view-finance-trans-common.component';

describe('ViewFinanceTransCommonComponent', () => {
  let component: ViewFinanceTransCommonComponent;
  let fixture: ComponentFixture<ViewFinanceTransCommonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFinanceTransCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFinanceTransCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
