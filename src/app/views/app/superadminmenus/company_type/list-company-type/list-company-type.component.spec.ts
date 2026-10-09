import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListCompanyTypeComponent } from './list-company-type.component';

describe('ListCompanyTypeComponent', () => {
  let component: ListCompanyTypeComponent;
  let fixture: ComponentFixture<ListCompanyTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListCompanyTypeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCompanyTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
