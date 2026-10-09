import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditShortLeavePolicyComponent } from './edit-short-leave-policy.component';

describe('EditShortLeavePolicyComponent', () => {
  let component: EditShortLeavePolicyComponent;
  let fixture: ComponentFixture<EditShortLeavePolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditShortLeavePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditShortLeavePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
