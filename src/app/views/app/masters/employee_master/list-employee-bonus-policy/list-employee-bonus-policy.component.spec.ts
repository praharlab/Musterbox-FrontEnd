import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeBonusPolicyComponent } from './list-employee-bonus-policy.component';

describe('ListEmployeeBonusPolicyComponent', () => {
  let component: ListEmployeeBonusPolicyComponent;
  let fixture: ComponentFixture<ListEmployeeBonusPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmployeeBonusPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeBonusPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
