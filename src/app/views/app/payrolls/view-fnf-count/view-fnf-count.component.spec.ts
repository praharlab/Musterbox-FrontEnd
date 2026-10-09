import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewFNFCountComponent } from './view-fnf-count.component';

describe('ViewFNFCountComponent', () => {
  let component: ViewFNFCountComponent;
  let fixture: ComponentFixture<ViewFNFCountComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFNFCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFNFCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
