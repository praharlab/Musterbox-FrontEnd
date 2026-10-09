import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditEmployeeMasterComponent } from './edit-employee-master.component';

describe('EditEmployeeMasterComponent', () => {
  let component: EditEmployeeMasterComponent;
  let fixture: ComponentFixture<EditEmployeeMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditEmployeeMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployeeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
