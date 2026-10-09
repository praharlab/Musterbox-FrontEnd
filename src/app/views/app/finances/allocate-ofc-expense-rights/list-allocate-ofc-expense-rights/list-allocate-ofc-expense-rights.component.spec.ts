import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListAllocateOfcExpenseRightsComponent } from './list-allocate-ofc-expense-rights.component';

describe('ListAllocateOfcExpenseRightsComponent', () => {
  let component: ListAllocateOfcExpenseRightsComponent;
  let fixture: ComponentFixture<ListAllocateOfcExpenseRightsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAllocateOfcExpenseRightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAllocateOfcExpenseRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
