import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeHousePropertyComponent } from './employee-house-property.component';

describe('EmployeeHousePropertyComponent', () => {
  let component: EmployeeHousePropertyComponent;
  let fixture: ComponentFixture<EmployeeHousePropertyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeHousePropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeHousePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
