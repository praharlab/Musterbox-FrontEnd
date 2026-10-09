import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeDiscrepancyLetterComponent } from './list-employee-discrepancy-letter.component';

describe('ListEmployeeDiscrepancyLetterComponent', () => {
  let component: ListEmployeeDiscrepancyLetterComponent;
  let fixture: ComponentFixture<ListEmployeeDiscrepancyLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmployeeDiscrepancyLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeDiscrepancyLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
