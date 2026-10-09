import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpiryJoiningDocumentTabComponent } from './expiry-joining-document-tab.component';

describe('ExpiryJoiningDocumentTabComponent', () => {
  let component: ExpiryJoiningDocumentTabComponent;
  let fixture: ComponentFixture<ExpiryJoiningDocumentTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiryJoiningDocumentTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiryJoiningDocumentTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
