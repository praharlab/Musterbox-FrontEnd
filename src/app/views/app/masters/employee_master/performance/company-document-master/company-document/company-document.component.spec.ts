import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyDocumentComponent } from './company-document.component';

describe('CompanyDocumentComponent', () => {
  let component: CompanyDocumentComponent;
  let fixture: ComponentFixture<CompanyDocumentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
