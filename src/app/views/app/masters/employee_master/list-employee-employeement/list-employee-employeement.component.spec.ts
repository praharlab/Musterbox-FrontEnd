import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeEmployeementComponent } from './list-employee-employeement.component';

describe('ListEmployeeEmployeementComponent', () => {
  let component: ListEmployeeEmployeementComponent;
  let fixture: ComponentFixture<ListEmployeeEmployeementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeEmployeementComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeEmployeementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
