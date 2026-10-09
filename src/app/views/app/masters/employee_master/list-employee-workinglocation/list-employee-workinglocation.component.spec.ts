import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeWorkinglocationComponent } from './list-employee-workinglocation.component';

describe('ListEmployeeWorkinglocationComponent', () => {
  let component: ListEmployeeWorkinglocationComponent;
  let fixture: ComponentFixture<ListEmployeeWorkinglocationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeWorkinglocationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeWorkinglocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
