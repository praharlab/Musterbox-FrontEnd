import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditBonusPolicyComponent } from './edit-bonus-policy.component';

describe('EditBonusPolicyComponent', () => {
  let component: EditBonusPolicyComponent;
  let fixture: ComponentFixture<EditBonusPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBonusPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBonusPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
