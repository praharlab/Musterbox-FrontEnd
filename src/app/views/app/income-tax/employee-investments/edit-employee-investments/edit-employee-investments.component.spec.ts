import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditEmployeeInvestmentsComponent } from './edit-employee-investments.component';

describe('EditEmployeeInvestmentsComponent', () => {
  let component: EditEmployeeInvestmentsComponent;
  let fixture: ComponentFixture<EditEmployeeInvestmentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEmployeeInvestmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployeeInvestmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
