import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportExpenseHeadComponent } from './import-expense-head.component';

describe('ImportExpenseHeadComponent', () => {
  let component: ImportExpenseHeadComponent;
  let fixture: ComponentFixture<ImportExpenseHeadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportExpenseHeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportExpenseHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
