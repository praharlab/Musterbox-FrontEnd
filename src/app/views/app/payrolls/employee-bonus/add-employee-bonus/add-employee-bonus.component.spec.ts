import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddEmployeeBonusComponent } from './add-employee-bonus.component';

describe('AddEmployeeBonusComponent', () => {
  let component: AddEmployeeBonusComponent;
  let fixture: ComponentFixture<AddEmployeeBonusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEmployeeBonusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
