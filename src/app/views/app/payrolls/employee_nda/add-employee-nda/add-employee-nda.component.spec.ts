import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddEmployeeNdaComponent } from './add-employee-nda.component';

describe('AddEmployeeNdaComponent', () => {
  let component: AddEmployeeNdaComponent;
  let fixture: ComponentFixture<AddEmployeeNdaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddEmployeeNdaComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeNdaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
