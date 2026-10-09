import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddEmployeeincentiveComponent } from './add-employeeincentive.component';

describe('AddEmployeeincentiveComponent', () => {
  let component: AddEmployeeincentiveComponent;
  let fixture: ComponentFixture<AddEmployeeincentiveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddEmployeeincentiveComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeincentiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
