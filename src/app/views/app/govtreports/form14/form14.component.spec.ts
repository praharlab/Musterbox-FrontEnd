import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Form14Component } from './form14.component';

describe('Form14Component', () => {
  let component: Form14Component;
  let fixture: ComponentFixture<Form14Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [Form14Component],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Form14Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
