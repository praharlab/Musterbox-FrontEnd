import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListPreboardingFormComponent } from './list-preboarding-form.component';

describe('ListPreboardingFormComponent', () => {
  let component: ListPreboardingFormComponent;
  let fixture: ComponentFixture<ListPreboardingFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPreboardingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPreboardingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
