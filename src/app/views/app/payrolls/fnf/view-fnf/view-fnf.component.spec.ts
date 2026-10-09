import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewFnfComponent } from './view-fnf.component';

describe('ViewFnfComponent', () => {
  let component: ViewFnfComponent;
  let fixture: ComponentFixture<ViewFnfComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFnfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFnfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
