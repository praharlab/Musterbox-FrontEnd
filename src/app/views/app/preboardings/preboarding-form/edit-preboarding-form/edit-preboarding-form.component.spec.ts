import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditPreboardingFormComponent } from './edit-preboarding-form.component';

describe('EditPreboardingFormComponent', () => {
  let component: EditPreboardingFormComponent;
  let fixture: ComponentFixture<EditPreboardingFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPreboardingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPreboardingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
