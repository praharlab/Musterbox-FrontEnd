import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditCompanyServiceStatusComponent } from './edit-company-service-status.component';

describe('EditCompanyServiceStatusComponent', () => {
  let component: EditCompanyServiceStatusComponent;
  let fixture: ComponentFixture<EditCompanyServiceStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCompanyServiceStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCompanyServiceStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
