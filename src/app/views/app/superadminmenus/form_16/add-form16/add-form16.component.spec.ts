import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddForm16Component } from './add-form16.component';

describe('AddForm16Component', () => {
  let component: AddForm16Component;
  let fixture: ComponentFixture<AddForm16Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddForm16Component],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddForm16Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
