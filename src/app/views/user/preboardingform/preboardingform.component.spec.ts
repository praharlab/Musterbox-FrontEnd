import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreboardingformComponent } from './preboardingform.component';

describe('PreboardingformComponent', () => {
  let component: PreboardingformComponent;
  let fixture: ComponentFixture<PreboardingformComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PreboardingformComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreboardingformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
