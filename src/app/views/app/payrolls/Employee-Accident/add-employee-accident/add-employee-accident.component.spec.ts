import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddEmployeeAccidentComponent } from './add-employee-accident.component';

describe('AddEmployeeAccidentComponent', () => {
  let component: AddEmployeeAccidentComponent;
  let fixture: ComponentFixture<AddEmployeeAccidentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddEmployeeAccidentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeAccidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
