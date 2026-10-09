import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListCompanyDocumentComponent } from './list-company-document.component';

describe('ListCompanyDocumentComponent', () => {
  let component: ListCompanyDocumentComponent;
  let fixture: ComponentFixture<ListCompanyDocumentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListCompanyDocumentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCompanyDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
