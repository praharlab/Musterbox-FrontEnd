import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreviousSalaryComponent } from './previous-salary.component';

describe('PreviousSalaryComponent', () => {
  let component: PreviousSalaryComponent;
  let fixture: ComponentFixture<PreviousSalaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousSalaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
