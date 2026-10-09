import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeDesignationComponent } from './list-employee-designation.component';

describe('ListEmployeeDesignationComponent', () => {
  let component: ListEmployeeDesignationComponent;
  let fixture: ComponentFixture<ListEmployeeDesignationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeDesignationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeDesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
