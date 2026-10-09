import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditHrSalaryFieldsComponent } from './edit-hr-salary-fields.component';

describe('EditHrSalaryFieldsComponent', () => {
  let component: EditHrSalaryFieldsComponent;
  let fixture: ComponentFixture<EditHrSalaryFieldsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditHrSalaryFieldsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHrSalaryFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
