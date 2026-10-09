import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyExpenseDataComponent } from './company-expense-data.component';

describe('CompanyExpenseDataComponent', () => {
  let component: CompanyExpenseDataComponent;
  let fixture: ComponentFixture<CompanyExpenseDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyExpenseDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyExpenseDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
