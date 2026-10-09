import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeAccidentComponent } from './list-employee-accident.component';

describe('ListEmployeeAccidentComponent', () => {
  let component: ListEmployeeAccidentComponent;
  let fixture: ComponentFixture<ListEmployeeAccidentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeAccidentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeAccidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
