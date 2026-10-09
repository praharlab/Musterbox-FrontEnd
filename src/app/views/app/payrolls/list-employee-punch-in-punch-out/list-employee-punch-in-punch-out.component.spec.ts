import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeePunchInPunchOutComponent } from './list-employee-punch-in-punch-out.component';

describe('ListEmployeePunchInPunchOutComponent', () => {
  let component: ListEmployeePunchInPunchOutComponent;
  let fixture: ComponentFixture<ListEmployeePunchInPunchOutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmployeePunchInPunchOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeePunchInPunchOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
