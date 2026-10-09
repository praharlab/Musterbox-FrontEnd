import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpiryDocumentTabComponent } from './expiry-document-tab.component';

describe('ExpiryDocumentTabComponent', () => {
  let component: ExpiryDocumentTabComponent;
  let fixture: ComponentFixture<ExpiryDocumentTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiryDocumentTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiryDocumentTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
