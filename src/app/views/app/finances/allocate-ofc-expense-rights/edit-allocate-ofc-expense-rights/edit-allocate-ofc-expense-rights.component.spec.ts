import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditAllocateOfcExpenseRightsComponent } from './edit-allocate-ofc-expense-rights.component';

describe('EditAllocateOfcExpenseRightsComponent', () => {
  let component: EditAllocateOfcExpenseRightsComponent;
  let fixture: ComponentFixture<EditAllocateOfcExpenseRightsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAllocateOfcExpenseRightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAllocateOfcExpenseRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
