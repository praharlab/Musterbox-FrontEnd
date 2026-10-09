import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddPreboardingComponent } from './add-preboarding.component';

describe('AddPreboardingComponent', () => {
  let component: AddPreboardingComponent;
  let fixture: ComponentFixture<AddPreboardingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddPreboardingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPreboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
