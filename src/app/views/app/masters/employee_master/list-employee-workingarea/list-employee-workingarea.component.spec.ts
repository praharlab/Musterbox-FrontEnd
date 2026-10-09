import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeWorkingareaComponent } from './list-employee-workingarea.component';

describe('ListEmployeeWorkingareaComponent', () => {
  let component: ListEmployeeWorkingareaComponent;
  let fixture: ComponentFixture<ListEmployeeWorkingareaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmployeeWorkingareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeWorkingareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
