import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeLetterComponent } from './list-employee-letter.component';

describe('ListEmployeeLetterComponent', () => {
  let component: ListEmployeeLetterComponent;
  let fixture: ComponentFixture<ListEmployeeLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeLetterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
