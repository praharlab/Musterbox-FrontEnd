import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MySalaryComponent } from './my-salary.component';

describe('MySalaryComponent', () => {
  let component: MySalaryComponent;
  let fixture: ComponentFixture<MySalaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MySalaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
