import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListHrSalaryFieldsComponent } from './list-hr-salary-fields.component';

describe('ListHrSalaryFieldsComponent', () => {
  let component: ListHrSalaryFieldsComponent;
  let fixture: ComponentFixture<ListHrSalaryFieldsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListHrSalaryFieldsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListHrSalaryFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
