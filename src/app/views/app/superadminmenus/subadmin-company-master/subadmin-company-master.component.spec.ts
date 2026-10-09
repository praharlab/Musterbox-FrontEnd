import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubadminCompanyMasterComponent } from './subadmin-company-master.component';

describe('SubadminCompanyMasterComponent', () => {
  let component: SubadminCompanyMasterComponent;
  let fixture: ComponentFixture<SubadminCompanyMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SubadminCompanyMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubadminCompanyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
