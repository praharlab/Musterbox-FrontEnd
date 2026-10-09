import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeIdCardComponent } from './employee-id-card.component';

describe('EmployeeIdCardComponent', () => {
  let component: EmployeeIdCardComponent;
  let fixture: ComponentFixture<EmployeeIdCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeIdCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeIdCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
