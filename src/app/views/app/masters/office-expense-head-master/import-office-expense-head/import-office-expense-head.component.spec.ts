import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportOfficeExpenseHeadComponent } from './import-office-expense-head.component';

describe('ImportOfficeExpenseHeadComponent', () => {
  let component: ImportOfficeExpenseHeadComponent;
  let fixture: ComponentFixture<ImportOfficeExpenseHeadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportOfficeExpenseHeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportOfficeExpenseHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
