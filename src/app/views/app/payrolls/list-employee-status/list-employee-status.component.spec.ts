import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeStatusComponent } from './list-employee-status.component';

describe('ListEmployeeStatusComponent', () => {
  let component: ListEmployeeStatusComponent;
  let fixture: ComponentFixture<ListEmployeeStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmployeeStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
