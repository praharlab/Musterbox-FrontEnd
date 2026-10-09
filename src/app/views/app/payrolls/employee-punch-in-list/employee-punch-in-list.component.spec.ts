import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeePunchInListComponent } from './employee-punch-in-list.component';

describe('EmployeePunchInListComponent', () => {
  let component: EmployeePunchInListComponent;
  let fixture: ComponentFixture<EmployeePunchInListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeePunchInListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeePunchInListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
