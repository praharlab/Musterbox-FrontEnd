import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeJoiningComponent } from './employee-joining.component';

describe('EmployeeJoiningComponent', () => {
  let component: EmployeeJoiningComponent;
  let fixture: ComponentFixture<EmployeeJoiningComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeJoiningComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeJoiningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
