import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeAddressComponent } from './list-employee-address.component';

describe('ListEmployeeAddressComponent', () => {
  let component: ListEmployeeAddressComponent;
  let fixture: ComponentFixture<ListEmployeeAddressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeAddressComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
