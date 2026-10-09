import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeProjectComponent } from './list-employee-project.component';

describe('ListEmployeeProjectComponent', () => {
  let component: ListEmployeeProjectComponent;
  let fixture: ComponentFixture<ListEmployeeProjectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmployeeProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
