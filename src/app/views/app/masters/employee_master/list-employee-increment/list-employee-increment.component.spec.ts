import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeIncrementComponent } from './list-employee-increment.component';

describe('ListEmployeeIncrementComponent', () => {
  let component: ListEmployeeIncrementComponent;
  let fixture: ComponentFixture<ListEmployeeIncrementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeIncrementComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeIncrementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
