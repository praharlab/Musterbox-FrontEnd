import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditPmsPolicyComponent } from './edit-pms-policy.component';

describe('EditPmsPolicyComponent', () => {
  let component: EditPmsPolicyComponent;
  let fixture: ComponentFixture<EditPmsPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPmsPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPmsPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
