import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewCompanyMasterComponent } from './view-company-master.component';

describe('ViewCompanyMasterComponent', () => {
  let component: ViewCompanyMasterComponent;
  let fixture: ComponentFixture<ViewCompanyMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCompanyMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompanyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
