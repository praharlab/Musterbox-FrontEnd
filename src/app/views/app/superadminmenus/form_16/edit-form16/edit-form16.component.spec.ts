import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditForm16Component } from './edit-form16.component';

describe('EditForm16Component', () => {
  let component: EditForm16Component;
  let fixture: ComponentFixture<EditForm16Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditForm16Component],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditForm16Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
