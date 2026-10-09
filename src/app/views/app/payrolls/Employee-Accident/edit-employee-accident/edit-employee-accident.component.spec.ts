import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditEmployeeAccidentComponent } from './edit-employee-accident.component';

describe('EditEmployeeAccidentComponent', () => {
  let component: EditEmployeeAccidentComponent;
  let fixture: ComponentFixture<EditEmployeeAccidentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditEmployeeAccidentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployeeAccidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
