import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeFamilyRejectComponent } from './employee-family-reject.component';

describe('EmployeeFamilyRejectComponent', () => {
  let component: EmployeeFamilyRejectComponent;
  let fixture: ComponentFixture<EmployeeFamilyRejectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeFamilyRejectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeFamilyRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
