import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeHolidaypolicyComponent } from './list-employee-holidaypolicy.component';

describe('ListEmployeeHolidaypolicyComponent', () => {
  let component: ListEmployeeHolidaypolicyComponent;
  let fixture: ComponentFixture<ListEmployeeHolidaypolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeHolidaypolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeHolidaypolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
