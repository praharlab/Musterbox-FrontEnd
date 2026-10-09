import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditAuthorizationmasterComponent } from './edit-authorizationmaster.component';

describe('EditAuthorizationmasterComponent', () => {
  let component: EditAuthorizationmasterComponent;
  let fixture: ComponentFixture<EditAuthorizationmasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditAuthorizationmasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAuthorizationmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
