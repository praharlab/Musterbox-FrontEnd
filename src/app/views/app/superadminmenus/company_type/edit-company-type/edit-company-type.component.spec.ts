import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditCompanyTypeComponent } from './edit-company-type.component';

describe('EditCompanyTypeComponent', () => {
  let component: EditCompanyTypeComponent;
  let fixture: ComponentFixture<EditCompanyTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditCompanyTypeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCompanyTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
