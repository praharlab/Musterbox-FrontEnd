import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Form21Component } from './form21.component';

describe('Form21Component', () => {
  let component: Form21Component;
  let fixture: ComponentFixture<Form21Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [Form21Component],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Form21Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
