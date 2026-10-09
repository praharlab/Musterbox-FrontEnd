import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Form18Component } from './form18.component';

describe('Form18Component', () => {
  let component: Form18Component;
  let fixture: ComponentFixture<Form18Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [Form18Component],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Form18Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
