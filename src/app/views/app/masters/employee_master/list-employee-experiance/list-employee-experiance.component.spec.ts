import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeExperianceComponent } from './list-employee-experiance.component';

describe('ListEmployeeExperianceComponent', () => {
  let component: ListEmployeeExperianceComponent;
  let fixture: ComponentFixture<ListEmployeeExperianceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeExperianceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeExperianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
