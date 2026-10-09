import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeStatusGraphComponent } from './employee-status-graph.component';

describe('EmployeeStatusGraphComponent', () => {
  let component: EmployeeStatusGraphComponent;
  let fixture: ComponentFixture<EmployeeStatusGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeStatusGraphComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeStatusGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
