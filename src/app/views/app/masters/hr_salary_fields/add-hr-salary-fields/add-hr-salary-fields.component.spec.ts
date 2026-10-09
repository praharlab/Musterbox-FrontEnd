import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddHrSalaryFieldsComponent } from './add-hr-salary-fields.component';

describe('AddHrSalaryFieldsComponent', () => {
  let component: AddHrSalaryFieldsComponent;
  let fixture: ComponentFixture<AddHrSalaryFieldsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddHrSalaryFieldsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHrSalaryFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
