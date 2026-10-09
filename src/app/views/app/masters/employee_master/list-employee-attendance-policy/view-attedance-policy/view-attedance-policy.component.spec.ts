import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewAttedancePolicyComponent } from './view-attedance-policy.component';

describe('ViewAttedancePolicyComponent', () => {
  let component: ViewAttedancePolicyComponent;
  let fixture: ComponentFixture<ViewAttedancePolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ViewAttedancePolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAttedancePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
