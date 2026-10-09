import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeBonusComponent } from './list-employee-bonus.component';

describe('ListEmployeeBonusComponent', () => {
  let component: ListEmployeeBonusComponent;
  let fixture: ComponentFixture<ListEmployeeBonusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmployeeBonusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
