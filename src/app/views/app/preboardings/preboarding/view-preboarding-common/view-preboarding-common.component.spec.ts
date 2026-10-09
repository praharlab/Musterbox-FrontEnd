import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewPreboardingCommonComponent } from './view-preboarding-common.component';

describe('ViewPreboardingCommonComponent', () => {
  let component: ViewPreboardingCommonComponent;
  let fixture: ComponentFixture<ViewPreboardingCommonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPreboardingCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPreboardingCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
