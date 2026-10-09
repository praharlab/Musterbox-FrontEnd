import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Form28Component } from './form28.component';

describe('Form28Component', () => {
  let component: Form28Component;
  let fixture: ComponentFixture<Form28Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Form28Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Form28Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
