import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAuthorizationmasterComponent } from './add-authorizationmaster.component';

describe('AddAuthorizationmasterComponent', () => {
  let component: AddAuthorizationmasterComponent;
  let fixture: ComponentFixture<AddAuthorizationmasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddAuthorizationmasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAuthorizationmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
