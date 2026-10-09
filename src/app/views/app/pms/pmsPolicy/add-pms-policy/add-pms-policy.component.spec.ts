import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddPmsPolicyComponent } from './add-pms-policy.component';

describe('AddPmsPolicyComponent', () => {
  let component: AddPmsPolicyComponent;
  let fixture: ComponentFixture<AddPmsPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPmsPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPmsPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
