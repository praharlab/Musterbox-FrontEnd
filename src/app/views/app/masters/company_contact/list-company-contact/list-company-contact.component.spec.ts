import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListCompanyContactComponent } from './list-company-contact.component';

describe('ListCompanyContactComponent', () => {
  let component: ListCompanyContactComponent;
  let fixture: ComponentFixture<ListCompanyContactComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListCompanyContactComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCompanyContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
