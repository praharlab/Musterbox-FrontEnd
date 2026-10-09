import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeBranchComponent } from './list-employee-branch.component';

describe('ListEmployeeBranchComponent', () => {
  let component: ListEmployeeBranchComponent;
  let fixture: ComponentFixture<ListEmployeeBranchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeBranchComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
