import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListCompanyMasterComponent } from './list-company-master.component';

describe('ListCompanyMasterComponent', () => {
  let component: ListCompanyMasterComponent;
  let fixture: ComponentFixture<ListCompanyMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListCompanyMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCompanyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
