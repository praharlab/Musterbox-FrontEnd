import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormCComponent } from './form-c.component';

describe('FormCComponent', () => {
  let component: FormCComponent;
  let fixture: ComponentFixture<FormCComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormCComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
