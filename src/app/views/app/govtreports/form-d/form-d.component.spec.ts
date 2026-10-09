import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormDComponent } from './form-d.component';

describe('FormDComponent', () => {
  let component: FormDComponent;
  let fixture: ComponentFixture<FormDComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormDComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
