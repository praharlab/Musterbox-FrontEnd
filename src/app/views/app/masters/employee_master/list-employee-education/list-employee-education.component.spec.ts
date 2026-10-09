import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeEducationComponent } from './list-employee-education.component';

describe('ListEmployeeEducationComponent', () => {
  let component: ListEmployeeEducationComponent;
  let fixture: ComponentFixture<ListEmployeeEducationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeEducationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
