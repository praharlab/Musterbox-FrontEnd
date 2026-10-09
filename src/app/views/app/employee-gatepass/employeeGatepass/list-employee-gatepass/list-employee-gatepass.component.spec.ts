import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeGatepassComponent } from './list-employee-gatepass.component';

describe('ListEmployeeGatepassComponent', () => {
  let component: ListEmployeeGatepassComponent;
  let fixture: ComponentFixture<ListEmployeeGatepassComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmployeeGatepassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeGatepassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
