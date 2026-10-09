import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeShiftComponent } from './list-employee-shift.component';

describe('ListEmployeeShiftComponent', () => {
  let component: ListEmployeeShiftComponent;
  let fixture: ComponentFixture<ListEmployeeShiftComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeShiftComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
