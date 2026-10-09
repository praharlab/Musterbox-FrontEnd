import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeDivisionComponent } from './list-employee-division.component';

describe('ListEmployeeDivisionComponent', () => {
  let component: ListEmployeeDivisionComponent;
  let fixture: ComponentFixture<ListEmployeeDivisionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmployeeDivisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
