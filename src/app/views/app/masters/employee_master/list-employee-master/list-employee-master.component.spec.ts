import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeMasterComponent } from './list-employee-master.component';

describe('ListEmployeeMasterComponent', () => {
  let component: ListEmployeeMasterComponent;
  let fixture: ComponentFixture<ListEmployeeMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
