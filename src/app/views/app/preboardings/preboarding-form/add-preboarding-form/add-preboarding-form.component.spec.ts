import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddPreboardingFormComponent } from './add-preboarding-form.component';

describe('AddPreboardingFormComponent', () => {
  let component: AddPreboardingFormComponent;
  let fixture: ComponentFixture<AddPreboardingFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPreboardingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPreboardingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
