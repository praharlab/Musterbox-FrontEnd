import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeInvestmentsComponent } from './list-employee-investments.component';

describe('ListEmployeeInvestmentsComponent', () => {
  let component: ListEmployeeInvestmentsComponent;
  let fixture: ComponentFixture<ListEmployeeInvestmentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmployeeInvestmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeInvestmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
