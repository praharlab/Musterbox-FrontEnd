import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddBonusPolicyComponent } from './add-bonus-policy.component';

describe('AddBonusPolicyComponent', () => {
  let component: AddBonusPolicyComponent;
  let fixture: ComponentFixture<AddBonusPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBonusPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBonusPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
