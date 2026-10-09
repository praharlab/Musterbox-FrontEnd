import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeWeekoffpolicyComponent } from './list-employee-weekoffpolicy.component';

describe('ListEmployeeWeekoffpolicyComponent', () => {
  let component: ListEmployeeWeekoffpolicyComponent;
  let fixture: ComponentFixture<ListEmployeeWeekoffpolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeWeekoffpolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeWeekoffpolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
