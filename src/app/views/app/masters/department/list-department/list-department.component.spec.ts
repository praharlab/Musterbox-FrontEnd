import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListDepartmentComponent } from './list-department.component';

describe('ListDepartmentComponent', () => {
  let component: ListDepartmentComponent;
  let fixture: ComponentFixture<ListDepartmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListDepartmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
