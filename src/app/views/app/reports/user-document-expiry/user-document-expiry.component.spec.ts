import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserDocumentExpiryComponent } from './user-document-expiry.component';

describe('UserDocumentExpiryComponent', () => {
  let component: UserDocumentExpiryComponent;
  let fixture: ComponentFixture<UserDocumentExpiryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDocumentExpiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDocumentExpiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
