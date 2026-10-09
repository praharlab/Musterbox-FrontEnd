import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddMinimumWagesMasterComponent } from './add-minimum-wages-master.component';

describe('AddMinimumWagesMasterComponent', () => {
  let component: AddMinimumWagesMasterComponent;
  let fixture: ComponentFixture<AddMinimumWagesMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMinimumWagesMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMinimumWagesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
