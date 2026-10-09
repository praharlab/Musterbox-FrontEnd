import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Form29Component } from './form29.component';

describe('Form29Component', () => {
  let component: Form29Component;
  let fixture: ComponentFixture<Form29Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [Form29Component],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Form29Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
