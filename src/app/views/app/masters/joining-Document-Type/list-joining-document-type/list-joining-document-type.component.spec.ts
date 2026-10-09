import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListJoiningDocumentTypeComponent } from './list-joining-document-type.component';

describe('ListJoiningDocumentTypeComponent', () => {
  let component: ListJoiningDocumentTypeComponent;
  let fixture: ComponentFixture<ListJoiningDocumentTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListJoiningDocumentTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListJoiningDocumentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
