import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddEmployeeInvestmentsComponent } from './add-employee-investments.component';

describe('AddEmployeeInvestmentsComponent', () => {
  let component: AddEmployeeInvestmentsComponent;
  let fixture: ComponentFixture<AddEmployeeInvestmentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEmployeeInvestmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeInvestmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
