import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeReportstoComponent } from './list-employee-reportsto.component';

describe('ListEmployeeReportstoComponent', () => {
  let component: ListEmployeeReportstoComponent;
  let fixture: ComponentFixture<ListEmployeeReportstoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeReportstoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeReportstoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
