import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeFamilyComponent } from './list-employee-family.component';

describe('ListEmployeeFamilyComponent', () => {
  let component: ListEmployeeFamilyComponent;
  let fixture: ComponentFixture<ListEmployeeFamilyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeFamilyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
