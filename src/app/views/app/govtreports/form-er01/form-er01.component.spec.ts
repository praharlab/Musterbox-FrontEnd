import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormER01Component } from './form-er01.component';

describe('FormER01Component', () => {
  let component: FormER01Component;
  let fixture: ComponentFixture<FormER01Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormER01Component],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormER01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
