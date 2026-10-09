import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAllocateOfcExpenseRightsComponent } from './add-allocate-ofc-expense-rights.component';

describe('AddAllocateOfcExpenseRightsComponent', () => {
  let component: AddAllocateOfcExpenseRightsComponent;
  let fixture: ComponentFixture<AddAllocateOfcExpenseRightsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAllocateOfcExpenseRightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAllocateOfcExpenseRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
