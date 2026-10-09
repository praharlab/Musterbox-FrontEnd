import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddCompanyServiceStatusComponent } from './add-company-service-status.component';

describe('AddCompanyServiceStatusComponent', () => {
  let component: AddCompanyServiceStatusComponent;
  let fixture: ComponentFixture<AddCompanyServiceStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCompanyServiceStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompanyServiceStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
