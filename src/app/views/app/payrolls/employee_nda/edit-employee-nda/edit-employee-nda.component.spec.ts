import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditEmployeeNdaComponent } from './edit-employee-nda.component';

describe('EditEmployeeNdaComponent', () => {
  let component: EditEmployeeNdaComponent;
  let fixture: ComponentFixture<EditEmployeeNdaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditEmployeeNdaComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployeeNdaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
